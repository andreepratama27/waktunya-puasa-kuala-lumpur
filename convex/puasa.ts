import { query, mutation } from "convex/server";
import { v } from "convex/values";

const RAMADAN_CONFIG_BY_YEAR: Record<number, { startDateISO: string; lengthDays: number }> = {
  2026: { startDateISO: "2026-02-19", lengthDays: 29 },
};

function getRamadanConfig(year: number) {
  const cfg = RAMADAN_CONFIG_BY_YEAR[year];
  if (!cfg) {
    return null;
  }
  return cfg;
}

function addDays(dateISO: string, days: number) {
  const [y, m, d] = dateISO.split("-").map((x) => Number(x));
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  const yyyy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function compareISO(a: string, b: string) {
  // safe because YYYY-MM-DD
  return a < b ? -1 : a > b ? 1 : 0;
}

export const seedRamadanDays = mutation({
  args: { year: v.number() },
  handler: async (ctx, args) => {
    const cfg = getRamadanConfig(args.year);
    if (!cfg) {
      return { ok: false as const, reason: "unsupported_year" as const };
    }

    const existing = await ctx.db
      .query("ramadanDays")
      .withIndex("by_year", (q) => q.eq("year", args.year))
      .first();

    if (existing) {
      return { ok: true as const, seeded: false as const, ...cfg };
    }

    for (let i = 0; i < cfg.lengthDays; i++) {
      const dateISO = addDays(cfg.startDateISO, i);
      await ctx.db.insert("ramadanDays", {
        year: args.year,
        dateISO,
        dayNumber: i + 1,
      });
    }

    return { ok: true as const, seeded: true as const, ...cfg };
  },
});

export const getProgressSummary = query({
  args: { year: v.number(), upToDateISO: v.string() },
  handler: async (ctx, args) => {
    const cfg = getRamadanConfig(args.year);
    if (!cfg) {
      return {
        ok: false as const,
        reason: "unsupported_year" as const,
        totalDays: 0,
        daysSoFar: 0,
        fastingCount: 0,
        startDateISO: null as string | null,
      };
    }

    const totalDays = cfg.lengthDays;
    const start = cfg.startDateISO;

    let daysSoFar = 0;
    if (compareISO(args.upToDateISO, start) >= 0) {
      const startDt = new Date(`${start}T00:00:00Z`);
      const upDt = new Date(`${args.upToDateISO}T00:00:00Z`);
      const diff = Math.floor((upDt.getTime() - startDt.getTime()) / 86400000) + 1;
      daysSoFar = Math.min(Math.max(diff, 0), totalDays);
    }

    const checkins = await ctx.db
      .query("fastCheckins")
      .withIndex("by_year", (q) => q.eq("year", args.year))
      .collect();

    const fastingCount = checkins
      .filter((c) => compareISO(c.dateISO, start) >= 0 && compareISO(c.dateISO, args.upToDateISO) <= 0)
      .filter((c) => c.status === "fasting").length;

    return {
      ok: true as const,
      totalDays,
      daysSoFar,
      fastingCount,
      startDateISO: start,
    };
  },
});

export const getCheckin = query({
  args: { year: v.number(), dateISO: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("fastCheckins")
      .withIndex("by_year_date", (q) => q.eq("year", args.year).eq("dateISO", args.dateISO))
      .first();

    return existing ?? null;
  },
});

export const submitCheckin = mutation({
  args: {
    year: v.number(),
    dateISO: v.string(),
    status: v.union(v.literal("fasting"), v.literal("not_fasting")),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("fastCheckins")
      .withIndex("by_year_date", (q) => q.eq("year", args.year).eq("dateISO", args.dateISO))
      .first();

    if (existing) {
      return { ok: false as const, reason: "locked" as const };
    }

    if (args.status === "not_fasting") {
      const r = (args.reason ?? "").trim();
      if (r.length < 5) {
        return { ok: false as const, reason: "reason_too_short" as const };
      }
    }

    await ctx.db.insert("fastCheckins", {
      year: args.year,
      dateISO: args.dateISO,
      status: args.status,
      reason: args.status === "not_fasting" ? args.reason?.trim() : undefined,
      createdAt: Date.now(),
    });

    return { ok: true as const };
  },
});
