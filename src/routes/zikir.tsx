import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/zikir")({
	component: ZikirPage,
});

const DEFAULT_TZ = "Asia/Kuala_Lumpur";
const STORAGE_PREFIX = "waktunyaPuasa:zikir99";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function getTimeZoneSafe() {
	try {
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		if (typeof tz === "string" && tz.includes("/")) return tz;
	} catch {
		// ignore
	}
	return DEFAULT_TZ;
}

function formatDateISOInTimeZone(date: Date, timeZone: string) {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(date);
	const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
	return `${get("year")}-${get("month")}-${get("day")}`;
}

function storageKey(dateISO: string) {
	return `${STORAGE_PREFIX}:${dateISO}`;
}

type Stored = {
	totalCount: number;
	updatedAtMs: number;
};

function load(dateISO: string): Stored | null {
	try {
		const raw = window.localStorage.getItem(storageKey(dateISO));
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Partial<Stored>;
		if (typeof parsed.totalCount !== "number") return null;
		return {
			totalCount: parsed.totalCount,
			updatedAtMs: typeof parsed.updatedAtMs === "number" ? parsed.updatedAtMs : Date.now(),
		};
	} catch {
		return null;
	}
}

function save(dateISO: string, value: Stored) {
	window.localStorage.setItem(storageKey(dateISO), JSON.stringify(value));
}

function phaseFor(totalCount: number) {
	if (totalCount < 33) return { label: "Subhanallah", phaseIndex: 0, phaseCount: totalCount };
	if (totalCount < 66) return { label: "Alhamdulillah", phaseIndex: 1, phaseCount: totalCount - 33 };
	return { label: "Allahu Akbar", phaseIndex: 2, phaseCount: totalCount - 66 };
}

function canVibrate() {
	return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

function vibrateTick() {
	if (!canVibrate()) return;
	try {
		navigator.vibrate(10);
	} catch {
		// ignore
	}
}

let audioCtx: AudioContext | null = null;

function playTickSound() {
	// Best-effort: small "click" using Web Audio (no external asset).
	// Works on most browsers after a user gesture; if blocked, fail silently.
	try {
		if (typeof window === "undefined") return;
		const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (!Ctx) return;
		if (!audioCtx) audioCtx = new Ctx();
		if (audioCtx.state === "suspended") {
			// resume is allowed only after a gesture; we are called from a gesture path.
			audioCtx.resume().catch(() => undefined);
		}
		const now = audioCtx.currentTime;
		const osc = audioCtx.createOscillator();
		const gain = audioCtx.createGain();
		osc.type = "square";
		osc.frequency.setValueAtTime(880, now);
		gain.gain.setValueAtTime(0.0001, now);
		gain.gain.exponentialRampToValueAtTime(0.08, now + 0.005);
		gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
		osc.connect(gain);
		gain.connect(audioCtx.destination);
		osc.start(now);
		osc.stop(now + 0.07);
	} catch {
		// ignore
	}
}

function ZikirPage() {
	const tz = useMemo(() => getTimeZoneSafe(), []);
	const todayISO = useMemo(() => formatDateISOInTimeZone(new Date(), tz), [tz]);

	const [totalCount, setTotalCount] = useState(0);
	const [celebrateStep, setCelebrateStep] = useState<0 | 1 | 2 | 3>(0); // 1=33,2=66,3=99

	useEffect(() => {
		const stored = load(todayISO);
		setTotalCount(stored?.totalCount ?? 0);
	}, [todayISO]);

	useEffect(() => {
		save(todayISO, { totalCount, updatedAtMs: Date.now() });
	}, [todayISO, totalCount]);

	const phase = phaseFor(clamp(totalCount, 0, 99));
	const phaseDone = phase.phaseCount >= 33;
	const totalDone = totalCount >= 99;

	useEffect(() => {
		// Trigger small celebration when crossing milestones.
		if (totalCount === 33) setCelebrateStep(1);
		if (totalCount === 66) setCelebrateStep(2);
		if (totalCount === 99) setCelebrateStep(3);
		if (celebrateStep !== 0) {
			const t = window.setTimeout(() => setCelebrateStep(0), 1200);
			return () => window.clearTimeout(t);
		}
	}, [totalCount, celebrateStep]);

	const increment = () => {
		setTotalCount((c) => {
			if (c >= 99) return c;
			const next = c + 1;
			return next;
		});
		vibrateTick();
	playTickSound();
	};

	const reset = () => setTotalCount(0);

	// Pull-release gesture
	const startX = useRef<number | null>(null);
	const pullPx = useRef(0);
	const [pullUiPx, setPullUiPx] = useState(0);
	const threshold = 90;

	const onPointerDown = (e: React.PointerEvent) => {
		if (totalDone) return;
		startX.current = e.clientX;
		pullPx.current = 0;
		setPullUiPx(0);
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	};

	const onPointerMove = (e: React.PointerEvent) => {
		if (startX.current === null) return;
		const delta = e.clientX - startX.current;
		const p = clamp(delta, 0, 140);
		pullPx.current = p;
		setPullUiPx(p);
	};

	const onPointerUp = () => {
		if (startX.current === null) return;
		const p = pullPx.current;
		startX.current = null;
		pullPx.current = 0;
		setPullUiPx(0);
		if (p >= threshold) increment();
	};

	return (
		<main className="page-wrap pb-10 text-theme-text">
			<div className="mx-auto max-w-3xl px-5 pt-6 sm:px-8">
				<header className="frost-card rounded-2xl border border-theme-border p-5">
					<p className="text-xs font-bold tracking-[0.12em] text-theme-accent uppercase">
						Zikir
					</p>
					<h1 className="mt-2 text-3xl font-black">Tasbih 99 (33×3)</h1>
					<p className="mt-2 text-sm text-theme-subtle">
						Geser ke samping lalu lepas untuk menambah hitungan. Progress reset otomatis setiap hari.
					</p>
					<div className="mt-4 flex items-center justify-between">
						<Link
							to="/"
							className="text-sm font-semibold text-theme-bright hover:text-theme-accent transition-colors"
						>
							← Kembali
						</Link>
						<button
							type="button"
							onClick={reset}
							className="rounded-full border border-theme-border bg-theme-wash px-4 py-2 text-sm font-bold hover:brightness-125 transition"
						>
							Reset
						</button>
					</div>
				</header>

				<section className="mt-6 grid gap-3">
					<article className="frost-card rounded-2xl border border-theme-border p-5">
						<div className="flex flex-wrap items-end justify-between gap-3">
							<div>
								<p className="text-sm text-theme-muted">Fase aktif</p>
								<p className="mt-1 text-2xl font-black">{phase.label}</p>
							</div>
							<div className="text-right">
								<p className="text-sm text-theme-muted">Progress</p>
								<p className="mt-1 text-2xl font-black">
									{Math.min(33, phase.phaseCount)} / 33
								</p>
							</div>
						</div>

						<div className="mt-4">
							<div className="h-2 w-full overflow-hidden rounded-full bg-theme-surface">
								<div
									className="h-full rounded-full bg-emerald-400"
									style={{ width: `${(Math.min(33, phase.phaseCount) / 33) * 100}%` }}
								/>
							</div>
							<p className="mt-2 text-xs text-theme-subtle">
								Total hari ini: <span className="font-bold">{Math.min(99, totalCount)}/99</span>
							</p>
						</div>
					</article>

					<article className="frost-card rounded-2xl border border-theme-border p-5">
						<p className="text-sm font-bold text-theme-muted">Manik Tasbih</p>

						<div className="mt-4 grid place-items-center">
							<div
								role="button"
								tabIndex={0}
								aria-disabled={totalDone}
								className={`relative grid h-56 w-full max-w-[340px] select-none place-items-center overflow-hidden rounded-3xl border bg-theme-wash ${
									totalDone
										? "border-emerald-300/60"
										: "border-theme-border"
								}`}
								onPointerDown={onPointerDown}
								onPointerMove={onPointerMove}
								onPointerUp={onPointerUp}
								onPointerCancel={onPointerUp}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										increment();
									}
								}}
								onClick={() => {
									// click fallback
									if (!totalDone) increment();
								}}
							>
								<div
									className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(52,211,153,.16),transparent_55%)]"
									aria-hidden="true"
								/>

								<div
									className="grid place-items-center"
									style={{ transform: `translateX(${pullUiPx}px)` }}
								>
									<div
										className={`grid h-24 w-24 place-items-center rounded-full border bg-emerald-400 text-emerald-950 shadow-[0_0_24px_rgba(52,211,153,.35)] transition-transform ${
											pullUiPx >= threshold
												? "scale-105"
												: "scale-100"
										}`}
									>
										<p className="text-3xl font-black">{Math.min(99, totalCount)}</p>
									</div>
									<p className="mt-3 text-xs font-bold tracking-[0.12em] text-theme-subtle uppercase">
										Geser ke kanan lalu lepas
									</p>
									<p className="mt-1 text-xs text-theme-dim">
										{canVibrate() ? "Getar aktif" : "Getar tidak tersedia di device ini"}
									</p>
								</div>

								{celebrateStep !== 0 ? (
									<div className="absolute inset-0 grid place-items-center bg-emerald-500/10">
										<div className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-black text-emerald-950 shadow-[0_0_24px_rgba(52,211,153,.35)]">
											{celebrateStep === 1
												? "Fase 1 selesai (33)"
												: celebrateStep === 2
													? "Fase 2 selesai (66)"
													: "Tasbih selesai (99)"}
										</div>
									</div>
								) : null}
							</div>
						</div>

						{totalDone ? (
							<p className="mt-4 text-center text-sm text-theme-muted">
								Sudah 99. Mantap, Bang. Kalau mau mulai lagi, pencet <span className="font-bold">Reset</span>.
							</p>
						) : (
							<p className="mt-4 text-center text-xs text-theme-subtle">
								Tips: geser ke kanan sampai terasa “nyangkut”, lalu lepas.
							</p>
						)}
					</article>
				</section>
			</div>
		</main>
	);
}
