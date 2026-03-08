import { useEffect, useMemo, useState } from "react";

const DISMISS_KEY = "waktunyaPuasa:pwaInstallPrompt:dismissedAt";
const COOLDOWN_DAYS = 7;

type BeforeInstallPromptEvent = Event & {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isInstalled() {
	if (typeof window === "undefined") return false;
	// Standard
	if (window.matchMedia?.("(display-mode: standalone)")?.matches) return true;
	// iOS legacy
	// @ts-expect-error iOS standalone
	if (window.navigator?.standalone) return true;
	return false;
}

function isIos() {
	if (typeof navigator === "undefined") return false;
	return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isInStandaloneIos() {
	// @ts-expect-error iOS standalone
	return Boolean(typeof window !== "undefined" && window.navigator?.standalone);
}

function shouldShowByCooldown() {
	try {
		const raw = window.localStorage.getItem(DISMISS_KEY);
		if (!raw) return true;
		const dismissedAt = Number(raw);
		if (!Number.isFinite(dismissedAt)) return true;
		const cooldownMs = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
		return Date.now() - dismissedAt > cooldownMs;
	} catch {
		return true;
	}
}

export function PwaInstallPrompt(props: { onlyHome?: boolean }) {
	const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
	const [open, setOpen] = useState(false);
	const [platform, setPlatform] = useState<"android" | "ios" | "other">("other");

	const force = useMemo(() => {
		if (typeof window === "undefined") return null;
		const q = new URLSearchParams(window.location.search);
		const v = q.get("pwaPrompt");
		return v === "ios" || v === "android" ? v : null;
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (props.onlyHome && window.location.pathname !== "/") return;
		if (isInstalled()) return;
		if (!shouldShowByCooldown()) return;

		const p: "android" | "ios" | "other" =
			force === "ios" ? "ios" : force === "android" ? "android" : isIos() ? "ios" : "android";
		setPlatform(p);

		const timer = window.setTimeout(() => setOpen(true), 2500);
		return () => window.clearTimeout(timer);
	}, [props.onlyHome, force]);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handler = (e: Event) => {
			e.preventDefault();
			setDeferred(e as BeforeInstallPromptEvent);
		};

		window.addEventListener("beforeinstallprompt", handler);
		window.addEventListener("appinstalled", () => setOpen(false));

		return () => {
			window.removeEventListener("beforeinstallprompt", handler);
		};
	}, []);

	const dismiss = () => {
		try {
			window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
		} catch {
			// ignore
		}
		setOpen(false);
	};

	const canNativeInstall = platform === "android" && Boolean(deferred);

	const onInstall = async () => {
		if (!deferred) return;
		try {
			await deferred.prompt();
			const choice = await deferred.userChoice;
			if (choice.outcome === "accepted") setOpen(false);
			setDeferred(null);
		} catch {
			// ignore
		}
	};

	if (!open) return null;
	if (platform === "ios" && isInStandaloneIos()) return null;

	return (
		<div className="fixed inset-x-0 bottom-4 z-50 px-4">
			<div className="mx-auto w-full max-w-xl rounded-2xl border border-theme-border bg-theme-wash p-4 backdrop-blur">
				<div className="flex items-start justify-between gap-3">
					<div>
						<p className="text-sm font-black text-theme-bright">Install aplikasi?</p>
						{platform === "ios" ? (
							<p className="mt-1 text-sm text-theme-subtle">
								Di iPhone/iPad: tap <b>Share</b> → <b>Add to Home Screen</b>.
							</p>
						) : (
							<p className="mt-1 text-sm text-theme-subtle">
								Biar akses lebih cepat + feel kayak app.
							</p>
						)}
					</div>
					<button
						type="button"
						onClick={dismiss}
						className="text-sm font-semibold text-theme-muted hover:text-theme-bright"
						aria-label="Tutup"
					>
						Nanti
					</button>
				</div>

				<div className="mt-3 flex flex-wrap gap-2">
					{platform === "ios" ? (
						<button
							type="button"
							onClick={dismiss}
							className="rounded-full bg-sky-300 px-4 py-2 text-sm font-black text-sky-950 hover:bg-sky-200"
						>
							Oke, ngerti
						</button>
					) : (
						<button
							type="button"
							onClick={onInstall}
							disabled={!canNativeInstall}
							className="rounded-full bg-sky-300 px-4 py-2 text-sm font-black text-sky-950 hover:bg-sky-200 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Install
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
