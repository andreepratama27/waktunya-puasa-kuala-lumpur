import { addDaysISO } from "@/lib/dateIso";

export type PuasaStatus = "fasting" | "not_fasting";

export type PuasaCheckin = {
  year: number;
  dateISO: string;
  status: PuasaStatus;
  reason?: string;
  createdAt: number;
};

export const RAMADAN_CONFIG_BY_YEAR: Record<
  number,
  { startDateISO: string; lengthDays: number }
> = {
  2026: { startDateISO: "2026-02-19", lengthDays: 29 },
};

const storageKey = (year: number) => `puasaTracker:${year}:checkins`;

type StoredCheckins = Record<string, PuasaCheckin>; // dateISO -> checkin

const readAll = (year: number): StoredCheckins => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey(year));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StoredCheckins;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeAll = (year: number, data: StoredCheckins) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(year), JSON.stringify(data));
};

export const getCheckin = (year: number, dateISO: string): PuasaCheckin | null => {
  const all = readAll(year);
  return all[dateISO] ?? null;
};

export const submitCheckin = (args: {
  year: number;
  dateISO: string;
  status: PuasaStatus;
  reason?: string;
}): { ok: true } | { ok: false; reason: "locked" | "reason_too_short" } => {
  const existing = getCheckin(args.year, args.dateISO);
  if (existing) return { ok: false, reason: "locked" };

  if (args.status === "not_fasting") {
    const r = (args.reason ?? "").trim();
    if (r.length < 5) return { ok: false, reason: "reason_too_short" };
  }

  const all = readAll(args.year);
  all[args.dateISO] = {
    year: args.year,
    dateISO: args.dateISO,
    status: args.status,
    reason: args.status === "not_fasting" ? args.reason?.trim() : undefined,
    createdAt: Date.now(),
  };
  writeAll(args.year, all);
  return { ok: true };
};

export const getProgressSummary = (args: {
  year: number;
  upToDateISO: string;
}):
  | {
      ok: true;
      totalDays: number;
      daysSoFar: number;
      fastingCount: number;
      startDateISO: string;
    }
  | { ok: false; reason: "unsupported_year"; totalDays: 0; daysSoFar: 0; fastingCount: 0; startDateISO: null } => {
  const cfg = RAMADAN_CONFIG_BY_YEAR[args.year];
  if (!cfg) {
    return { ok: false, reason: "unsupported_year", totalDays: 0, daysSoFar: 0, fastingCount: 0, startDateISO: null };
  }

  const totalDays = cfg.lengthDays;
  const start = cfg.startDateISO;

  const compareISO = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

  let daysSoFar = 0;
  if (compareISO(args.upToDateISO, start) >= 0) {
    const startDt = new Date(`${start}T00:00:00Z`);
    const upDt = new Date(`${args.upToDateISO}T00:00:00Z`);
    const diff = Math.floor((upDt.getTime() - startDt.getTime()) / 86400000) + 1;
    daysSoFar = Math.min(Math.max(diff, 0), totalDays);
  }

  const all = readAll(args.year);
  const fastingCount = Object.values(all)
    .filter((c) => compareISO(c.dateISO, start) >= 0 && compareISO(c.dateISO, args.upToDateISO) <= 0)
    .filter((c) => c.status === "fasting").length;

  return { ok: true, totalDays, daysSoFar, fastingCount, startDateISO: start };
};

export const getAllowedDateISOs = (todayISO: string) => {
  return { todayISO, yesterdayISO: addDaysISO(todayISO, -1) };
};
