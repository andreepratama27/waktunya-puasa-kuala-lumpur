import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { formatDateISOInTimeZone, getUserTimeZone } from "@/lib/dateIso";
import {
	getCheckin,
	getProgressSummary,
	RAMADAN_CONFIG_BY_YEAR,
} from "@/lib/puasaTracker";

const CURRENT_YEAR = new Date().getFullYear();

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

const addDaysISO = (dateISO: string, days: number) => {
	const [y, m, d] = dateISO.split("-").map(Number);
	const dt = new Date(Date.UTC(y, m - 1, d));
	dt.setUTCDate(dt.getUTCDate() + days);
	const yyyy = dt.getUTCFullYear();
	const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
	const dd = String(dt.getUTCDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
};

type DayState = "future" | "today" | "past";

type CheckpointDay = {
	dayNumber: number;
	dateISO: string;
	state: DayState;
	checked: boolean;
};

export function PuasaTrackerBanner() {
	const [tick, setTick] = useState(0);

	useEffect(() => {
		const onStorage = () => setTick((x) => x + 1);
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	const tz = getUserTimeZone();
	const todayISO = formatDateISOInTimeZone(new Date(), tz);

	const summary = getProgressSummary({ year: CURRENT_YEAR, upToDateISO: todayISO });
	const cfg = RAMADAN_CONFIG_BY_YEAR[CURRENT_YEAR];
	const startDateISO = cfg?.startDateISO;

	const days: CheckpointDay[] = useMemo(() => {
		// tick is intentionally used to recompute when localStorage changes.
		void tick;

		if (!summary.ok || !startDateISO) return [];

		const out: CheckpointDay[] = [];
		for (let i = 0; i < summary.totalDays; i++) {
			const dayNumber = i + 1;
			const dateISO = addDaysISO(startDateISO, i);
			const state: DayState =
				dateISO === todayISO ? "today" : dateISO < todayISO ? "past" : "future";

			const check = getCheckin(CURRENT_YEAR, dateISO);
			const checked = check?.status === "fasting";
			out.push({ dayNumber, dateISO, state, checked });
		}
		return out;
	}, [startDateISO, summary, todayISO, tick]);

	if (!summary.ok) {
		return (
			<section className="frost-card rounded-2xl border border-amber-400/40 bg-amber-500/10 p-5">
				<p className="text-xs font-bold tracking-[0.12em] text-amber-200 uppercase">
					Puasa Tracker
				</p>
				<p className="mt-2 text-white/70">
					Ramadan tracker belum dikonfigurasi untuk tahun {CURRENT_YEAR}.
				</p>
			</section>
		);
	}

	const pct = summary.totalDays ? (summary.fastingCount / summary.totalDays) * 100 : 0;

	return (
		<section className="frost-card rounded-2xl border border-white/10 p-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p className="text-xs font-bold tracking-[0.12em] text-emerald-200 uppercase">
						Puasa Tracker
					</p>
					<p className="mt-1 text-xl font-black">
						Puasa: {summary.fastingCount} / {summary.totalDays}
					</p>
					<p className="mt-1 text-sm text-white/60">Progress sampai hari ini</p>
				</div>
				<div className="text-right">
					<p className="text-sm text-white/60">Hari berjalan</p>
					<p className="text-2xl font-black text-emerald-200">{summary.daysSoFar}</p>
				</div>
			</div>

			<div className="mt-4">
				<div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
					<div
						className="h-full rounded-full bg-emerald-400"
						style={{ width: `${clampPercent(pct)}%` }}
					/>
				</div>
			</div>

			{/* Checkpoint cards */}
			<div className="mt-5">
				<div className="flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
					{days.map((d) => {
						const headerClass =
							d.state === "today"
								? "bg-emerald-300 text-emerald-950"
								: d.state === "future"
									? "bg-white/10 text-white/60"
									: "bg-emerald-500/15 text-emerald-200";

						const cardClass =
							d.state === "today"
								? "border-emerald-300/40 bg-emerald-500/10"
								: d.state === "future"
									? "border-white/10 bg-white/5"
									: "border-white/10 bg-white/5";

						return (
							<article
								key={d.dateISO}
								className={`min-w-[110px] overflow-hidden rounded-2xl border ${cardClass}`}
							>
								<div
									className={`px-3 py-2 text-center text-sm font-bold ${headerClass}`}
								>
									Day {d.dayNumber}
								</div>
								<div className="grid place-items-center gap-2 px-3 py-4">
									<div
										className={`grid h-14 w-14 place-items-center rounded-full border ${
											d.checked
												? "border-emerald-300/50 bg-emerald-400/15"
												: "border-white/10 bg-white/5"
										}`}
									>
										<div
											className={`h-8 w-8 rounded-full ${
												d.checked ? "bg-emerald-400" : "bg-white/20"
											}`}
										/>
									</div>

									<p className="text-xs text-white/55">{d.dateISO}</p>
									<p
										className={`text-sm font-black ${
											d.checked ? "text-emerald-200" : "text-white/50"
										}`}
									>
										{d.checked ? "PUASA" : "—"}
									</p>
								</div>
							</article>
						);
					})}
				</div>
			</div>

			{/* Big CTA like reference */}
			<div className="mt-5">
				<Link
					to="/check-in"
					className="block w-full rounded-full bg-emerald-400 px-6 py-4 text-center text-lg font-black text-emerald-950 hover:bg-emerald-300 transition-colors"
				>
					Check in
				</Link>
				<p className="mt-2 text-xs text-white/45">
					Data tersimpan di localStorage (per device/browser).
				</p>
			</div>
		</section>
	);
}
