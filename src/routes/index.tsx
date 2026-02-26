import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
	Clock3,
	ForkKnife,
	Landmark,
	MapPin,
	Moon,
	Sun,
	SunMoon,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

type WeekRow = {
	dayLabel: string;
	fullDate: string;
	hijri: string;
	imsak: string;
	subuh: string;
	zuhur: string;
	asar: string;
	maghrib: string;
	isyak: string;
};

const dayMap: Record<string, string> = {
	ahad: "Sunday",
	isnin: "Monday",
	selasa: "Tuesday",
	rabu: "Wednesday",
	khamis: "Thursday",
	jumaat: "Friday",
	jumat: "Friday",
	sabtu: "Saturday",
};

const asString = (value: unknown) => {
	if (typeof value !== "string") return "-";
	const clean = value.trim();
	return clean.length ? clean : "-";
};

const pickField = (row: Record<string, unknown>, keys: string[]) => {
	for (const key of keys) {
		if (row[key] !== undefined && row[key] !== null) return asString(row[key]);
	}
	return "-";
};

const toDayLabel = (dayRaw: string) => {
	const lower = dayRaw.toLowerCase().trim();
	return dayMap[lower] ?? dayRaw;
};

const extractRows = (raw: unknown): Record<string, unknown>[] => {
	if (Array.isArray(raw)) return raw as Record<string, unknown>[];
	if (raw && typeof raw === "object") {
		const objectRaw = raw as Record<string, unknown>;
		const prayerList = objectRaw.prayerTime;
		if (Array.isArray(prayerList))
			return prayerList as Record<string, unknown>[];
	}
	return [];
};

const normalizeRows = (raw: unknown): WeekRow[] => {
	const rows = extractRows(raw);
	return rows.map((row) => {
		const rawDay = pickField(row, ["day", "hari", "weekday"]);
		return {
			dayLabel: toDayLabel(rawDay),
			fullDate: pickField(row, ["date", "tarikh", "gregorian"]),
			hijri: pickField(row, ["hijri", "hijridate"]),
			imsak: pickField(row, ["imsak"]),
			subuh: pickField(row, ["fajr", "subuh"]),
			zuhur: pickField(row, ["dhuhr", "zohor", "zuhur"]),
			asar: pickField(row, ["asr", "asar"]),
			maghrib: pickField(row, ["maghrib"]),
			isyak: pickField(row, ["isha", "isyak"]),
		};
	});
};

const toMinutes = (value: string) => {
	const clean = value.trim().toUpperCase();
	const match = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
	if (!match) return null;
	let hour = Number(match[1]);
	const minute = Number(match[2]);
	const period = match[3];
	if (period === "AM" && hour === 12) hour = 0;
	if (period === "PM" && hour !== 12) hour += 12;
	if (!period && hour > 23) return null;
	return hour * 60 + minute;
};

const formatDiff = (diffSeconds: number) => {
	const hours = Math.floor(diffSeconds / 3600);
	const mins = Math.floor((diffSeconds % 3600) / 60);
	const secs = diffSeconds % 60;
	return `${hours}H ${mins}M ${secs}S`;
};

const NEAR_WINDOW_SECS = 15 * 60; // 900 seconds

const isNearWindow = (value: string, nowSeconds: number): boolean => {
	const prayerMinutes = toMinutes(value);
	if (prayerMinutes === null) return false;
	const prayerSeconds = prayerMinutes * 60;
	const diff = prayerSeconds - nowSeconds;
	return (
		Math.abs(diff) <= NEAR_WINDOW_SECS ||
		Math.abs(diff + 86400) <= NEAR_WINDOW_SECS ||
		Math.abs(diff - 86400) <= NEAR_WINDOW_SECS
	);
};

const getTodayName = () =>
	new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());

const getFocusRow = (rows: WeekRow[]) => {
	if (!rows.length) return null;
	const today = rows.find((row) => row.dayLabel === getTodayName());
	return today ?? rows[0];
};

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["prayerTime"],
		queryFn: async () => {
			const response = await fetch("/api/prayer-time", {
				cache: "no-store",
			});
			if (!response.ok) throw new Error("Failed to fetch prayer time");
			const json = await response.json();
			const normalized = normalizeRows(json);
			if (!normalized.length) throw new Error("Failed to fetch prayer time");
			return normalized;
		},
		staleTime: 5 * 60 * 1000,
	});
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		const timer = window.setInterval(() => {
			setNow(new Date());
		}, 1000);
		return () => window.clearInterval(timer);
	}, []);

	if (isLoading) {
		return (
			<main className="page-wrap" aria-busy="true" aria-live="polite">
				<div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
					<div className="frost-card flex items-center gap-3 rounded-2xl p-5 text-white/85">
						<Clock3
							className="h-5 w-5 animate-pulse text-emerald-300"
							aria-hidden="true"
						/>
						<p>Loading prayer times...</p>
					</div>
				</div>
			</main>
		);
	}

	if (isError || !data) {
		return (
			<main className="page-wrap">
				<div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
					<div className="frost-card rounded-2xl border border-red-500/40 p-6 text-red-200">
						<p className="text-sm uppercase tracking-[0.18em] text-red-300">
							Status
						</p>
						<h1 className="mt-2 text-2xl font-extrabold">Homepage</h1>
						<p className="mt-4 text-base">Failed to fetch prayer time</p>
					</div>
				</div>
			</main>
		);
	}

	const focus = getFocusRow(data);
	const heroTime = `${now.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	})}`;
	const heroPieces = heroTime.split(" ");
	const prayerLabels = [
		{
			key: "subuh",
			label: "Fajr",
			icon: <Moon className="h-4 w-4" aria-hidden="true" />,
		},
		{
			key: "zuhur",
			label: "Dhuhr",
			icon: <Sun className="h-4 w-4" aria-hidden="true" />,
		},
		{
			key: "asar",
			label: "Asr",
			icon: <SunMoon className="h-4 w-4" aria-hidden="true" />,
		},
		{
			key: "maghrib",
			label: "Maghrib",
			icon: <Sun className="h-4 w-4" aria-hidden="true" />,
		},
		{
			key: "isyak",
			label: "Isha",
			icon: <Moon className="h-4 w-4" aria-hidden="true" />,
		},
	] as const;
	const nowTotalSeconds =
		now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
	const nextPrayer = focus
		? prayerLabels.reduce<{
				key: (typeof prayerLabels)[number]["key"];
				label: string;
				diff: number;
			} | null>((closest, item) => {
				const targetMinutes = toMinutes(focus[item.key]);
				if (targetMinutes === null) return closest;
				let diff = targetMinutes * 60 - nowTotalSeconds;
				if (diff <= 0) diff += 24 * 3600;
				if (!closest || diff < closest.diff) {
					return { key: item.key, label: item.label, diff };
				}
				return closest;
			}, null)
		: null;
	const iftarTime = focus?.maghrib ?? "-";
	const sahoorTime = focus?.imsak ?? focus?.subuh ?? "-";
	const dateLine = focus
		? `${focus.dayLabel}, ${focus.fullDate}${focus.hijri !== "-" ? ` • ${focus.hijri}` : ""}`
		: "Selangor, Malaysia";

	return (
		<main className="page-wrap pb-10 text-white">
			<div className="mx-auto max-w-6xl px-5 pt-5 sm:px-8">
				<header className="frost-card rounded-2xl border border-white/10 px-4 py-3 sm:px-6">
					<div className="flex items-center gap-2 text-sm font-semibold text-emerald-100 sm:text-lg">
						<Landmark className="h-5 w-5 text-emerald-300" aria-hidden="true" />
						<span>Waktunya Puasa</span>
					</div>
				</header>

				<section className="mt-7 text-center">
					{nextPrayer ? (
						<p className="mx-auto inline-flex rounded-full border border-emerald-300/30 bg-emerald-500/15 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-emerald-200 uppercase">
							NEXT: {nextPrayer.label} IN {formatDiff(nextPrayer.diff)}
						</p>
					) : null}
					<div className="mt-5 flex items-baseline justify-center gap-2 sm:gap-3">
						<p className="text-6xl font-black tracking-tight sm:text-8xl">
							{heroPieces[0]}
						</p>
						<p className="text-2xl font-semibold text-white/70 sm:text-5xl">
							{heroPieces[1]}
						</p>
					</div>
					<p className="mt-3 text-3xl font-bold text-emerald-300">
						{nextPrayer ? `${nextPrayer.label} Time` : "Prayer Time"}
					</p>
					<p className="mt-2 text-sm text-white/60">{dateLine}</p>
				</section>

				<section className="mt-8 grid gap-3 md:grid-cols-2">
					<article className="frost-card rounded-2xl border border-white/10 p-5">
						<p className="text-sm text-white/70">Sahoor Ends</p>
						<div className="mt-1 flex items-center justify-between">
							<p className="text-4xl font-black">{sahoorTime}</p>
							<Clock3 className="h-6 w-6 text-white/45" aria-hidden="true" />
						</div>
					</article>
					<article className="frost-card rounded-2xl border border-emerald-300/35 bg-emerald-500/10 p-5">
						<p className="text-sm text-emerald-200">Iftar Time</p>
						<div className="mt-1 flex items-center justify-between">
							<p className="text-4xl font-black">{iftarTime}</p>
							<span className="grid h-10 w-10 place-content-center rounded-full bg-emerald-400 text-emerald-950 shadow-[0_0_25px_rgba(52,211,153,.5)]">
								<ForkKnife className="h-5 w-5" aria-hidden="true" />
							</span>
						</div>
					</article>
				</section>

				<section className="mt-8">
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-2xl font-bold">Daily Prayers</h2>
						<Dialog>
							<DialogTrigger asChild>
								<button
									type="button"
									className="text-sm text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer"
								>
									View Weekly Calendar
								</button>
							</DialogTrigger>
							<DialogContent className="max-h-[90vh] overflow-y-auto">
								<DialogHeader>
									<DialogTitle>Weekly Prayer Timetable (SGR01)</DialogTitle>
								</DialogHeader>
								<div className="mt-4 overflow-x-auto">
									<table className="w-full min-w-[640px] border-collapse text-left text-sm">
										<caption className="sr-only">
											Prayer times for Selangor zone SGR01 this week
										</caption>
										<thead>
											<tr className="border-b border-white/15 text-white/70">
												<th className="px-3 py-2 font-semibold">Day</th>
												<th className="px-3 py-2 font-semibold">Date</th>
												<th className="px-3 py-2 font-semibold">Subuh</th>
												<th className="px-3 py-2 font-semibold">Zuhur</th>
												<th className="px-3 py-2 font-semibold">Asar</th>
												<th className="px-3 py-2 font-semibold">Maghrib</th>
												<th className="px-3 py-2 font-semibold">Isyak</th>
											</tr>
										</thead>
										<tbody>
											{data.map((row, index) => (
												<tr
													key={`${row.dayLabel}-${index}`}
													className="border-b border-white/10 last:border-b-0"
												>
													<td className="px-3 py-2 font-semibold">
														{row.dayLabel}
													</td>
													<td className="px-3 py-2 text-white/75">
														{row.fullDate}
													</td>
													<td className="px-3 py-2">{row.subuh}</td>
													<td className="px-3 py-2">{row.zuhur}</td>
													<td className="px-3 py-2">{row.asar}</td>
													<td className="px-3 py-2">{row.maghrib}</td>
													<td className="px-3 py-2">{row.isyak}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</DialogContent>
						</Dialog>
					</div>
					<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
						{focus
							? prayerLabels.map((item) => {
									const value = focus[item.key];
									const active = item.key === nextPrayer?.key;
									const near = !active && isNearWindow(value, nowTotalSeconds);
									return (
										<article
											key={item.key}
											className={`frost-card rounded-2xl border p-4 ${
												active
													? "border-emerald-300 bg-emerald-400 text-white"
													: near
														? "border-amber-400/60 shadow-[0_0_14px_rgba(251,191,36,0.25)]"
														: "border-white/10"
											}`}
										>
											<div className="flex items-center justify-between text-sm">
												<p className="text-white/70">{item.label}</p>
												<span
													className={
														active
															? "text-emerald-900"
															: near
																? "text-amber-300"
																: "text-white/60"
													}
												>
													{item.icon}
												</span>
											</div>
											<p className="mt-2 text-3xl font-black">{value}</p>
										</article>
									);
								})
							: null}
					</div>
				</section>

				<section className="mt-8 grid gap-3 w-full">
					<article className="frost-card relative overflow-hidden rounded-2xl border border-white/10 p-5">
						<div
							className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(52,211,153,.18),transparent_55%)]"
							aria-hidden="true"
						/>
						<div className="relative">
							<p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.1em] text-emerald-300 uppercase">
								<MapPin className="h-4 w-4" aria-hidden="true" />
								Current Location
							</p>
							<p className="mt-2 text-3xl font-black">Selangor, Malaysia</p>
							<p className="mt-1 text-white/70">
								Prayer times calculation method: JAKIM Malaysia
							</p>
						</div>
					</article>
				</section>

				<footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-5 text-sm text-white/60">
					<p>
						© {now.getFullYear()} Waktunya Puasa by <a href="https://www.linkedin.com/in/andre-pratama27/" target="_blank" noopener noreferrer>@andreepratama27</a>. All data is fetched from
						the&nbsp;
						<a
							className="underline"
							href="https://www.e-solat.gov.my/"
							target="_blank"
							rel="noopener noreferrer"
						>
							E-Solat API
						</a>
						.
					</p>
					{/* <div className="flex items-center gap-4">
						<p>Privacy</p>
						<p>Terms</p>
						<p>API</p>
					</div> */}
				</footer>
			</div>
		</main>
	);
}
