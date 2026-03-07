import { Link } from "@tanstack/react-router";

export function KumpulanDoaBanner() {
	return (
		<section className="frost-card relative overflow-hidden rounded-2xl border border-theme-border p-5">
			<div
				className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(251,191,36,.18),transparent_55%)]"
				aria-hidden="true"
			/>
			<div className="relative flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs font-bold tracking-[0.12em] text-amber-200 uppercase">
						Kumpulan Doa
					</p>
					<p className="mt-1 text-xl font-black">Bacaan Setelah Sholat</p>
					<p className="mt-1 text-sm text-theme-subtle">
						Arab + latin + arti, ringkas dan mudah dibaca.
					</p>
				</div>
				<Link
					to="/kumpulan-doa"
					className="inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-amber-950 hover:bg-amber-200 transition-colors"
				>
					Buka
				</Link>
			</div>
		</section>
	);
}
