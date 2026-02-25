import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
	Clock3,
	Compass,
	ForkKnife,
	Landmark,
	MapPin,
	Moon,
	Sun,
	SunMoon,
} from "lucide-react";

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

type LoaderData = {
	data: WeekRow[] | null;
	error: string | null;
};

const fetchPrayerTime = createServerFn({ method: "GET" }).handler(async () => {
	const response = await fetch(
		"https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=week&zone=SGR01",
		{ cache: "no-store" },
	);

	if (!response.ok) {
		throw new Error("Failed to fetch prayer time");
	}

	return response.json();
});

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

const formatTime = (minutes: number) => {
	const hour24 = Math.floor(minutes / 60) % 24;
	const minute = minutes % 60;
	const period = hour24 >= 12 ? "PM" : "AM";
	const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
	return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
};

const nextAsarIn = (asarTime: string) => {
	const target = toMinutes(asarTime);
	if (target === null) return null;
	const now = new Date();
	const nowMinutes = now.getHours() * 60 + now.getMinutes();
	let diff = target - nowMinutes;
	if (diff <= 0) diff += 24 * 60;
	const hours = Math.floor(diff / 60);
	const mins = diff % 60;
	return `${hours}H ${mins}M`;
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
	pendingComponent: Loading,
	loader: async (): Promise<LoaderData> => {
		try {
			const prayerData = await fetchPrayerTime();
			const normalized = normalizeRows(prayerData);
			return {
				data: normalized,
				error: normalized.length ? null : "Failed to fetch prayer time",
			};
		} catch (_error) {
			return {
				data: null,
				error: "Failed to fetch prayer time",
			};
		}
	},
});

function Loading() {
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

function App() {
	const { data, error } = Route.useLoaderData();

	if (error || !data) {
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
	const now = new Date();
	const heroTime = `${now.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
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
	const nextAsr = focus ? nextAsarIn(focus.asar) : null;
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
					{nextAsr ? (
						<p className="mx-auto inline-flex rounded-full border border-emerald-300/30 bg-emerald-500/15 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-emerald-200 uppercase">
							NEXT: ASR IN {nextAsr}
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
					<p className="mt-3 text-3xl font-bold text-emerald-300">Dhuhr Time</p>
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
						<p className="text-sm text-emerald-300">View Weekly Calendar</p>
					</div>
					<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
						{focus
							? prayerLabels.map((item) => {
									const value = focus[item.key];
									const active = item.key === "zuhur";
									return (
										<article
											key={item.key}
											className={`frost-card rounded-2xl border p-4 ${
												active
													? "border-emerald-300 bg-emerald-400 text-white"
													: "border-white/10"
											}`}
										>
											<div className="flex items-center justify-between text-sm">
												<p className="text-white/70">{item.label}</p>
												<span
													className={
														active ? "text-emerald-900" : "text-white/60"
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

				<section className="mt-8">
					<div className="frost-card overflow-x-auto rounded-2xl border border-white/10 p-4">
						<h2 className="mb-3 text-xl font-bold">
							Weekly Prayer Timetable (SGR01)
						</h2>
						<table className="w-full min-w-[760px] border-collapse text-left text-sm">
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
										<td className="px-3 py-2 font-semibold">{row.dayLabel}</td>
										<td className="px-3 py-2 text-white/75">{row.fullDate}</td>
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
				</section>

				<footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-5 text-sm text-white/60">
					<p>
						© {now.getFullYear()} Waktunya Puasa. All data is fetched from
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
