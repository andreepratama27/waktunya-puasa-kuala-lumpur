import { createFileRoute, Link } from "@tanstack/react-router";
import { DOA_AFTER_SHOLAT } from "@/content/doaAfterSholat";

export const Route = createFileRoute("/kumpulan-doa")({
	component: KumpulanDoaPage,
});

function KumpulanDoaPage() {
	return (
		<main className="page-wrap pb-10 text-theme-text">
			<div className="mx-auto max-w-3xl px-5 pt-6 sm:px-8">
				<header className="frost-card rounded-2xl border border-theme-border p-5">
					<p className="text-xs font-bold tracking-[0.12em] text-theme-accent uppercase">
						Kumpulan Doa
					</p>
					<h1 className="mt-2 text-3xl font-black">Bacaan Setelah Sholat</h1>
					<p className="mt-2 text-sm text-theme-subtle">
						Ringkas: Arab + latin + arti (untuk dibaca selepas solat).
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

				<section className="mt-6 grid gap-3">
					{DOA_AFTER_SHOLAT.map((item) => (
						<article
							key={item.id}
							className="frost-card rounded-2xl border border-theme-border p-5"
						>
							<h2 className="text-lg font-extrabold">{item.title}</h2>
							<p
								className="mt-3 text-2xl leading-[1.9]"
								dir="rtl"
							>
								{item.arab}
							</p>
							<p className="mt-3 text-sm text-theme-muted">
								<span className="font-semibold">Latin:</span> {item.latin}
							</p>
							<p className="mt-2 text-sm text-theme-subtle">
								<span className="font-semibold">Arti:</span> {item.meaning}
							</p>
						</article>
					))}
				</section>
			</div>
		</main>
	);
}
