import { useEffect, useMemo, useState } from "react";
import { formatDateISOInTimeZone, getUserTimeZone } from "@/lib/dateIso";
import {
	getCheckin,
	getProgressSummary,
	RAMADAN_CONFIG_BY_YEAR,
	submitCheckin,
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
	const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null);

	useEffect(() => {
		const onStorage = () => setTick((x) => x + 1);
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	const tz = getUserTimeZone();
	const todayISO = formatDateISOInTimeZone(new Date(), tz);

	const summary = getProgressSummary({
		year: CURRENT_YEAR,
		upToDateISO: todayISO,
	});
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
				<p className="mt-2 text-theme-muted">
					Ramadan tracker belum dikonfigurasi untuk tahun {CURRENT_YEAR}.
				</p>
			</section>
		);
	}

	const pct = summary.totalDays
		? (summary.fastingCount / summary.totalDays) * 100
		: 0;

	const handleCheckIn = () => {
		if (!selectedDateISO) return;
		submitCheckin({
			year: CURRENT_YEAR,
			dateISO: selectedDateISO,
			status: "fasting",
		});
		setSelectedDateISO(null);
		setTick((x) => x + 1);
	};

	return (
		<section className="frost-card rounded-2xl border border-theme-border p-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p className="text-xs font-bold tracking-[0.12em] text-theme-accent uppercase">
						Puasa Tracker
					</p>
					<p className="mt-1 text-xl font-black">
						Puasa: {summary.fastingCount} / {summary.totalDays}
					</p>
					<p className="mt-1 text-sm text-theme-subtle">Progress sampai hari ini</p>
				</div>
				<div className="text-right">
					<p className="text-sm text-theme-subtle">Hari berjalan</p>
					<p className="text-2xl font-black text-theme-accent">
						{summary.daysSoFar}
					</p>
				</div>
			</div>

			<div className="mt-4">
				<div className="h-2 w-full overflow-hidden rounded-full bg-theme-surface">
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
						const isSelectable = d.state !== "future" && !d.checked;
						const isSelected = selectedDateISO === d.dateISO;

						const headerClass =
							d.state === "today"
								? "bg-emerald-300 text-emerald-950"
								: d.state === "future"
									? "bg-theme-surface text-theme-subtle"
									: "bg-theme-badge text-theme-accent";

						const cardClass = isSelected
							? "border-emerald-300 bg-emerald-500/20"
							: d.state === "today"
								? "border-emerald-300/40 bg-emerald-500/10"
								: "border-theme-border bg-theme-wash";

						return (
							<article
								key={d.dateISO}
								role={isSelectable ? "button" : undefined}
								tabIndex={isSelectable ? 0 : undefined}
								className={`min-w-[110px] overflow-hidden rounded-2xl border transition-colors ${cardClass} ${isSelectable ? "cursor-pointer hover:brightness-125" : ""}`}
								onClick={
									isSelectable
										? () => setSelectedDateISO(isSelected ? null : d.dateISO)
										: undefined
								}
								onKeyDown={
									isSelectable
										? (e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													setSelectedDateISO(isSelected ? null : d.dateISO);
												}
											}
										: undefined
								}
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
												? "border-emerald-400"
												: "border-theme-border bg-theme-wash"
										}`}
									>
										<div
											className={`h-8 w-8 rounded-full ${d.checked ? "bg-emerald-400" : "bg-theme-surface"}`}
										/>
									</div>

									<p className="text-xs text-theme-subtle">{d.dateISO}</p>
									<p
										className={`text-sm font-black ${
											d.checked ? "text-theme-accent" : "text-theme-subtle"
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
				<button
					type="button"
					onClick={handleCheckIn}
					disabled={!selectedDateISO}
					className={`block w-full rounded-full px-6 py-4 text-center text-lg font-black transition-colors ${selectedDateISO ? "bg-emerald-400 text-emerald-950 hover:bg-emerald-300" : "cursor-not-allowed bg-theme-surface text-theme-dim"}`}
				>
					Check in
				</button>
				<p className="mt-2 text-xs text-theme-subtle">
					Data tersimpan di localStorage (per device/browser).
				</p>
			</div>
		</section>
	);
}
