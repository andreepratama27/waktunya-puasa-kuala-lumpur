import { Link } from "@tanstack/react-router";

export function TasbihDigitalBanner() {
	return (
		<section className="frost-card relative overflow-hidden rounded-2xl border border-theme-border p-5">
			<div
				className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(52,211,153,.18),transparent_55%)]"
				aria-hidden="true"
			/>
			<div className="relative flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs font-bold tracking-[0.12em] text-emerald-200 uppercase">
						Tasbih Digital
					</p>
					<p className="mt-1 text-xl font-black">Tasbih 99 (33×3)</p>
					<p className="mt-1 text-sm text-theme-subtle">
						Geser ke kanan lalu lepas. Subhanallah → Alhamdulillah → Allahu Akbar.
					</p>
				</div>
				<Link
					to="/zikir"
					className="inline-flex items-center justify-center rounded-full bg-emerald-300 px-5 py-3 text-sm font-black text-emerald-950 hover:bg-emerald-200 transition-colors"
				>
					Mulai
				</Link>
			</div>
		</section>
	);
}
