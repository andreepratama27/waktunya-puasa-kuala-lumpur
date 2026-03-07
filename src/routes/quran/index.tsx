import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchChapters } from "@/lib/quranApi";

export const Route = createFileRoute("/quran/")({
	component: QuranIndexPage,
});

type LastRead = {
	surah: number;
	ayah: number;
	updatedAtMs: number;
};

const LAST_READ_KEY = "waktunyaPuasa:quran:lastRead";

function loadLastRead(): LastRead | null {
	try {
		const raw = window.localStorage.getItem(LAST_READ_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Partial<LastRead>;
		if (typeof parsed.surah !== "number") return null;
		if (typeof parsed.ayah !== "number") return null;
		return {
			surah: parsed.surah,
			ayah: parsed.ayah,
			updatedAtMs: typeof parsed.updatedAtMs === "number" ? parsed.updatedAtMs : Date.now(),
		};
	} catch {
		return null;
	}
}

function QuranIndexPage() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["quranChapters"],
		queryFn: fetchChapters,
		staleTime: 24 * 60 * 60 * 1000,
	});

	const lastRead = typeof window !== "undefined" ? loadLastRead() : null;

	return (
		<main className="page-wrap pb-10 text-theme-text">
			<div className="mx-auto max-w-3xl px-5 pt-6 sm:px-8">
				<header className="frost-card rounded-2xl border border-theme-border p-5">
					<p className="text-xs font-bold tracking-[0.12em] text-theme-accent uppercase">
						Quran
					</p>
					<h1 className="mt-2 text-3xl font-black">Daftar Surah</h1>
					<p className="mt-2 text-sm text-theme-subtle">
						Baca Quran dengan Arab + latin (akademik) + terjemahan Indonesia.
					</p>
					<div className="mt-4">
						<Link
							to="/"
							className="text-sm font-semibold text-theme-bright hover:text-theme-accent transition-colors"
						>
							← Kembali
						</Link>
					</div>
				</header>

				{lastRead ? (
					<section className="mt-4">
						<Link
							to="/quran/$surah"
							params={{ surah: String(lastRead.surah) }}
							className="frost-card block rounded-2xl border border-emerald-300/40 bg-emerald-500/10 p-5 hover:brightness-125 transition"
						>
							<p className="text-xs font-bold tracking-[0.12em] text-emerald-200 uppercase">
								Lanjut baca
							</p>
							<p className="mt-1 text-lg font-black">
								Surah {lastRead.surah} • Ayat {lastRead.ayah}
							</p>
						</Link>
					</section>
				) : null}

				<section className="mt-6">
					{isLoading ? (
						<div className="frost-card rounded-2xl border border-theme-border p-5 text-theme-muted">
							Loading surah...
						</div>
					) : isError || !data ? (
						<div className="frost-card rounded-2xl border border-red-500/40 p-5 text-red-200">
							Failed to load surah list.
						</div>
					) : (
						<div className="grid gap-2">
							{data.map((c) => (
								<Link
									key={c.id}
									to="/quran/$surah"
									params={{ surah: String(c.id) }}
									className="frost-card block rounded-2xl border border-theme-border p-4 hover:brightness-125 transition"
								>
									<div className="flex items-center justify-between gap-3">
										<div>
											<p className="text-sm font-bold">
												{c.id}. {c.name_simple}
											</p>
											<p className="text-xs text-theme-subtle">
												{c.name_complex} • {c.revelation_place} • {c.verses_count} ayat
											</p>
										</div>
										<p className="text-xl font-black" dir="rtl">
											{c.name_arabic}
										</p>
									</div>
								</Link>
							))}
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
