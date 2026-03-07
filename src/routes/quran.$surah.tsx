import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { Settings2, Volume2, VolumeX } from "lucide-react";
import { fetchSurahBundle } from "@/lib/quranApi";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/quran/$surah")({
	component: QuranSurahPage,
});

type QuranSettings = {
	showLatin: boolean;
	showTranslation: boolean;
};

const SETTINGS_KEY = "waktunyaPuasa:quran:settings";
const LAST_READ_KEY = "waktunyaPuasa:quran:lastRead";

function loadSettings(): QuranSettings {
	if (typeof window === "undefined") return { showLatin: true, showTranslation: true };
	try {
		const raw = window.localStorage.getItem(SETTINGS_KEY);
		if (!raw) return { showLatin: true, showTranslation: true };
		const parsed = JSON.parse(raw) as Partial<QuranSettings>;
		return {
			showLatin: parsed.showLatin !== false,
			showTranslation: parsed.showTranslation !== false,
		};
	} catch {
		return { showLatin: true, showTranslation: true };
	}
}

function saveSettings(value: QuranSettings) {
	window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(value));
}

function QuranSurahPage() {
	const { surah } = Route.useParams();
	const surahId = Number(surah);

	const [settings, setSettings] = useState<QuranSettings>(() => loadSettings());

	useEffect(() => {
		saveSettings(settings);
	}, [settings]);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["quranSurah", surahId],
		queryFn: () => fetchSurahBundle({ surahId, translationId: 33, recitationId: 7 }),
		staleTime: 6 * 60 * 60 * 1000,
	});

	const [activeAudioKey, setActiveAudioKey] = useState<string | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const onPlay = async (verseKey: string, url?: string) => {
		if (!url) return;
		try {
			if (!audioRef.current) audioRef.current = new Audio();
			const audio = audioRef.current;
			if (audio.src !== url) audio.src = url;
			setActiveAudioKey(verseKey);
			await audio.play();
		} catch {
			setActiveAudioKey(null);
		}
	};

	const onStop = () => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.pause();
		setActiveAudioKey(null);
	};

	useEffect(() => {
		if (!data) return;
		try {
			const raw = window.localStorage.getItem(LAST_READ_KEY);
			if (!raw) return;
			const parsed = JSON.parse(raw) as { surah?: number; ayah?: number };
			if (parsed.surah !== surahId || typeof parsed.ayah !== "number") return;
			const el = document.getElementById(`ayah-${parsed.ayah}`);
			if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
		} catch {
			// ignore
		}
	}, [data, surahId]);

	const headerTitle = useMemo(() => {
		if (!data) return `Surah ${surahId}`;
		return `${data.chapter.id}. ${data.chapter.name_simple}`;
	}, [data, surahId]);

	return (
		<main className="page-wrap pb-10 text-theme-text">
			<div className="mx-auto max-w-3xl px-5 pt-6 sm:px-8">
				<header className="frost-card rounded-2xl border border-theme-border p-5">
					<div className="flex items-start justify-between gap-3">
						<div>
							<p className="text-xs font-bold tracking-[0.12em] text-theme-accent uppercase">
								Quran
							</p>
							<h1 className="mt-2 text-3xl font-black">{headerTitle}</h1>
							<p className="mt-2 text-sm text-theme-subtle" dir="rtl">
								{data?.chapter.name_arabic ?? ""}
							</p>
						</div>

						<Dialog>
							<DialogTrigger asChild>
								<button
									type="button"
									className="rounded-full border border-theme-border bg-theme-wash p-3 hover:brightness-125 transition"
									aria-label="Quran settings"
								>
									<Settings2 className="h-5 w-5 text-theme-bright" />
								</button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Settings</DialogTitle>
								</DialogHeader>
								<div className="mt-4 grid gap-3">
									<label className="flex items-center justify-between gap-3">
										<span className="text-sm font-semibold">Show Latin</span>
										<input
											type="checkbox"
											checked={settings.showLatin}
											onChange={(e) =>
												setSettings((s) => ({ ...s, showLatin: e.target.checked }))
											}
										/>
									</label>
									<label className="flex items-center justify-between gap-3">
										<span className="text-sm font-semibold">Show Translation (ID)</span>
										<input
											type="checkbox"
											checked={settings.showTranslation}
											onChange={(e) =>
												setSettings((s) => ({ ...s, showTranslation: e.target.checked }))
											}
										/>
									</label>
								</div>
							</DialogContent>
						</Dialog>
					</div>

					<div className="mt-4 flex items-center justify-between">
						<Link
							to="/quran"
							className="text-sm font-semibold text-theme-bright hover:text-theme-accent transition-colors"
						>
							← Daftar Surah
						</Link>
					</div>
				</header>

				<section className="mt-6">
					{isLoading ? (
						<div className="frost-card rounded-2xl border border-theme-border p-5 text-theme-muted">
							Loading ayat...
						</div>
					) : isError || !data ? (
						<div className="frost-card rounded-2xl border border-red-500/40 p-5 text-red-200">
							Failed to load surah.
						</div>
					) : (
						<div className="grid gap-3">
							{data.verses.map((v) => (
								<article
									key={v.verseKey}
									id={`ayah-${v.verseNumber}`}
									className="frost-card rounded-2xl border border-theme-border p-5"
									onPointerEnter={() => {
										try {
											window.localStorage.setItem(
												LAST_READ_KEY,
												JSON.stringify({ surah: surahId, ayah: v.verseNumber, updatedAtMs: Date.now() })
											);
										} catch {
											// ignore
										}
									}}
								>
									<div className="flex items-center justify-between gap-3">
										<p className="text-sm font-black text-theme-accent">{v.verseNumber}</p>
										{v.audioUrl ? (
											<button
												type="button"
												onClick={() =>
													activeAudioKey === v.verseKey ? onStop() : onPlay(v.verseKey, v.audioUrl)
												}
												className="rounded-full border border-theme-border bg-theme-wash p-2 hover:brightness-125 transition"
												aria-label="Play audio"
											>
												{activeAudioKey === v.verseKey ? (
													<VolumeX className="h-4 w-4" />
												) : (
													<Volume2 className="h-4 w-4" />
												)}
											</button>
										) : null}
									</div>

									<p className="mt-3 text-3xl leading-[2.1]" dir="rtl">
										{v.arab}
									</p>

									{settings.showLatin ? (
										<p className="mt-3 text-sm text-theme-muted">
											<span className="font-semibold">Latin:</span> {v.latin || "-"}
										</p>
									) : null}

									{settings.showTranslation ? (
										<p className="mt-2 text-sm text-theme-subtle">
											<span className="font-semibold">Arti (ID):</span> {v.translationId || "-"}
										</p>
									) : null}
								</article>
							))}
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
