import { Link } from "@tanstack/react-router";

export function QuranBanner() {
	return (
		<section className="frost-card relative overflow-hidden rounded-2xl border border-theme-border p-5">
			<div
				className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(59,130,246,.16),transparent_55%)]"
				aria-hidden="true"
			/>
			<div className="relative flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs font-bold tracking-[0.12em] text-sky-200 uppercase">
						Quran
					</p>
					<p className="mt-1 text-xl font-black">Baca Quran</p>
					<p className="mt-1 text-sm text-theme-subtle">
						Arab + latin (akademik) + terjemahan Indonesia.
					</p>
				</div>
				<Link
					to="/quran"
					className="inline-flex items-center justify-center rounded-full bg-sky-300 px-5 py-3 text-sm font-black text-sky-950 hover:bg-sky-200 transition-colors"
				>
					Buka
				</Link>
			</div>
		</section>
	);
}
