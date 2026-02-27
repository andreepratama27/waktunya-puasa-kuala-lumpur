import { useQuery } from "convex/react";
import { Link } from "@tanstack/react-router";
import { api } from "@/convex/_generated/api";
import { getUserTimeZone, formatDateISOInTimeZone } from "../lib/dateIso";

const CURRENT_YEAR = new Date().getFullYear();

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

export function PuasaTrackerBanner() {
  const tz = getUserTimeZone();
  const todayISO = formatDateISOInTimeZone(new Date(), tz);

  // If Convex isn't configured, useQuery will throw because no provider.
  // We avoid that by only rendering this component when Convex exists.
  const summary = useQuery(api.puasa.getProgressSummary, {
    year: CURRENT_YEAR,
    upToDateISO: todayISO,
  });

  if (!summary) {
    return (
      <article className="frost-card rounded-2xl border border-white/10 p-5" aria-busy="true">
        <p className="text-sm text-white/70">Puasa Tracker</p>
        <p className="mt-2 text-white/60">Loading progress…</p>
      </article>
    );
  }

  if (!summary.ok) {
    return (
      <article className="frost-card rounded-2xl border border-amber-400/40 bg-amber-500/10 p-5">
        <p className="text-sm font-bold tracking-[0.12em] text-amber-200 uppercase">Puasa Tracker</p>
        <p className="mt-2 text-white/70">
          Ramadan tracker belum dikonfigurasi untuk tahun {CURRENT_YEAR}.
        </p>
      </article>
    );
  }

  const pct = summary.totalDays ? (summary.fastingCount / summary.totalDays) * 100 : 0;

  return (
    <article className="frost-card relative overflow-hidden rounded-2xl border border-white/10 p-5">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(52,211,153,.16),transparent_55%)]"
        aria-hidden="true"
      />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.12em] text-emerald-200 uppercase">Puasa Tracker</p>
            <p className="mt-1 text-2xl font-black">
              Puasa: {summary.fastingCount} / {summary.totalDays}
            </p>
            <p className="mt-1 text-sm text-white/60">Hari berjalan: {summary.daysSoFar}</p>
          </div>
          <Link
            to="/check-in"
            className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-sm font-bold text-emerald-950 hover:bg-emerald-300 transition-colors"
          >
            Check-in
          </Link>
        </div>

        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-400"
              style={{ width: `${clampPercent(pct)}%` }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
