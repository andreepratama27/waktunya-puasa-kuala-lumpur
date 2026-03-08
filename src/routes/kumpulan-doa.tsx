import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DOA_AFTER_SHOLAT } from "@/content/doaAfterSholat";
import { ZIKIR_WIRID_AFTER_SHOLAT } from "@/content/zikirWiridAfterSholat";

export const Route = createFileRoute("/kumpulan-doa")({
	component: KumpulanDoaPage,
});

type TabKey = "bacaan" | "zikir";

function KumpulanDoaPage() {
	const [tab, setTab] = useState<TabKey>("bacaan");

	const header = useMemo(() => {
		if (tab === "zikir") {
			return {
				title: "Zikir dan Wirid",
				desc: "Susunan zikir & wirid setelah sholat (Arab + latin + arti).",
			};
		}
		return {
			title: "Bacaan Setelah Sholat",
			desc: "Ringkas: Arab + latin + arti (untuk dibaca setelah sholat).",
		};
	}, [tab]);

	return (
		<main className="page-wrap pb-10 text-theme-text">
			<div className="mx-auto max-w-3xl px-5 pt-6 sm:px-8">
				<header className="frost-card rounded-2xl border border-theme-border p-5">
					<p className="text-xs font-bold tracking-[0.12em] text-theme-accent uppercase">
						Kumpulan Doa
					</p>
					<h1 className="mt-2 text-3xl font-black">{header.title}</h1>
					<p className="mt-2 text-sm text-theme-subtle">{header.desc}</p>

					<div className="mt-4 flex flex-wrap items-center gap-2">
						<button
							type="button"
							onClick={() => setTab("bacaan")}
							className={`rounded-full px-4 py-2 text-sm font-black transition border ${
								tab === "bacaan"
									? "border-sky-300 bg-sky-300 text-sky-950"
									: "border-theme-border bg-theme-wash text-theme-bright hover:brightness-125"
							}`}
						>
							Bacaan Setelah Sholat
						</button>
						<button
							type="button"
							onClick={() => setTab("zikir")}
							className={`rounded-full px-4 py-2 text-sm font-black transition border ${
								tab === "zikir"
									? "border-sky-300 bg-sky-300 text-sky-950"
									: "border-theme-border bg-theme-wash text-theme-bright hover:brightness-125"
							}`}
						>
							Zikir dan Wirid
						</button>

						<div className="ml-auto">
							<Link
								to="/"
								className="text-sm font-semibold text-theme-bright hover:text-theme-accent transition-colors"
							>
								← Kembali
							</Link>
						</div>
					</div>
				</header>

				{tab === "bacaan" ? (
					<section className="mt-6 grid gap-3">
						{DOA_AFTER_SHOLAT.map((item) => (
							<article
								key={item.id}
								className="frost-card rounded-2xl border border-theme-border p-5"
							>
								<h2 className="text-lg font-extrabold">{item.title}</h2>
								<p className="mt-3 text-2xl leading-[1.9]" dir="rtl">
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
				) : (
					<section className="mt-6 grid gap-3">
						{ZIKIR_WIRID_AFTER_SHOLAT.map((item) => (
							<article
								key={item.id}
								className="frost-card rounded-2xl border border-theme-border p-5"
							>
								<div className="flex items-start justify-between gap-3">
									<div>
										<h2 className="text-lg font-extrabold">{item.title}</h2>
										{item.badge ? (
											<p className="mt-1 inline-flex rounded-full border border-emerald-300/40 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-200">
												{item.badge}
											</p>
										) : null}
									</div>
								</div>

								<p className="mt-3 text-2xl leading-[1.9]" dir="rtl">
									{item.arab}
								</p>
								<p className="mt-3 text-sm text-theme-muted">
									<span className="font-semibold">Latin:</span> {item.latin}
								</p>
								<p className="mt-2 text-sm text-theme-subtle">
									<span className="font-semibold">Arti:</span> {item.meaning}
								</p>

								{item.notes?.length ? (
									<div className="mt-3 rounded-xl border border-theme-border bg-theme-wash p-3">
										<p className="text-xs font-black tracking-[0.12em] text-theme-muted uppercase">
											Catatan
										</p>
										<ul className="mt-2 grid gap-1 text-sm text-theme-subtle list-disc pl-5">
											{item.notes.map((n) => (
												<li key={n}>{n}</li>
											))}
										</ul>
									</div>
								) : null}
							</article>
						))}
					</section>
				)}
			</div>
		</main>
	);
}
