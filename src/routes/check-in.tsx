import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useId, useMemo, useState } from "react";
import { addDaysISO, formatDateISOInTimeZone, getUserTimeZone } from "@/lib/dateIso";
import { getCheckin, submitCheckin } from "@/lib/puasaTracker";

export const Route = createFileRoute("/check-in")({
  component: CheckInPage,
});

const CURRENT_YEAR = new Date().getFullYear();

type DayChoice = "today" | "yesterday";

type StatusChoice = "fasting" | "not_fasting";

function CheckInPage() {
  const tz = useMemo(() => getUserTimeZone(), []);
  const todayISO = formatDateISOInTimeZone(new Date(), tz);
  const yesterdayISO = addDaysISO(todayISO, -1);

  const [dayChoice, setDayChoice] = useState<DayChoice>("today");
  const [status, setStatus] = useState<StatusChoice>("fasting");
  const [reason, setReason] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const dateISO = dayChoice === "today" ? todayISO : yesterdayISO;
  const reasonId = useId();

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset UI state whenever the selected date changes
  useEffect(() => {
    setSubmitted(false);
    setSubmitError(null);
  }, [dateISO]);

  const existing = useMemo(() => {
    void refresh;
    return getCheckin(CURRENT_YEAR, dateISO);
  }, [dateISO, refresh]);

  const locked = existing !== null;

  const onSubmit = () => {
    setSubmitError(null);

    const trimmed = reason.trim();
    if (status === "not_fasting" && trimmed.length < 5) {
      setSubmitError("Alasan minimal 5 karakter.");
      return;
    }

    const result = submitCheckin({
      year: CURRENT_YEAR,
      dateISO,
      status,
      reason: status === "not_fasting" ? trimmed : undefined,
    });

    if (!result.ok) {
      if (result.reason === "locked") {
        setSubmitError("Check-in untuk tanggal ini sudah dikunci.");
        return;
      }
      if (result.reason === "reason_too_short") {
        setSubmitError("Alasan minimal 5 karakter.");
        return;
      }
      setSubmitError("Gagal simpan check-in.");
      return;
    }

    setSubmitted(true);
    setRefresh((x) => x + 1);
  };

  return (
    <main className="page-wrap pb-10 text-white">
      <div className="mx-auto max-w-3xl px-5 pt-5 sm:px-8">
        <header className="frost-card rounded-2xl border border-white/10 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-emerald-200 uppercase">
                Puasa Tracker
              </p>
              <h1 className="mt-1 text-2xl font-black">Check-in Puasa</h1>
            </div>
            <Link
              to="/"
              className="text-sm text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              Homepage
            </Link>
          </div>
        </header>

        <section className="mt-6 frost-card rounded-2xl border border-white/10 p-6">
          <p className="text-sm text-white/70">Timezone kamu</p>
          <p className="mt-1 font-semibold text-white/85">{tz}</p>

          <div className="mt-6 grid gap-4">
            <div>
              <p className="text-sm font-semibold">Tanggal check-in</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setDayChoice("today")}
                  className={`rounded-full px-4 py-2 text-sm font-bold border transition-colors ${
                    dayChoice === "today"
                      ? "border-emerald-300 bg-emerald-500/15 text-emerald-100"
                      : "border-white/10 text-white/70 hover:text-white"
                  } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  Hari ini ({todayISO})
                </button>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setDayChoice("yesterday")}
                  className={`rounded-full px-4 py-2 text-sm font-bold border transition-colors ${
                    dayChoice === "yesterday"
                      ? "border-emerald-300 bg-emerald-500/15 text-emerald-100"
                      : "border-white/10 text-white/70 hover:text-white"
                  } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  Kemarin ({yesterdayISO})
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Status</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setStatus("fasting")}
                  className={`rounded-full px-4 py-2 text-sm font-bold border transition-colors ${
                    status === "fasting"
                      ? "border-emerald-300 bg-emerald-400 text-emerald-950"
                      : "border-white/10 text-white/70 hover:text-white"
                  } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  Puasa
                </button>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setStatus("not_fasting")}
                  className={`rounded-full px-4 py-2 text-sm font-bold border transition-colors ${
                    status === "not_fasting"
                      ? "border-amber-300 bg-amber-500/20 text-amber-100"
                      : "border-white/10 text-white/70 hover:text-white"
                  } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  Tidak Puasa
                </button>
              </div>
            </div>

            {status === "not_fasting" ? (
              <div>
                <label className="text-sm font-semibold" htmlFor={reasonId}>
                  Alasan (min 5 karakter)
                </label>
                <textarea
                  id={reasonId}
                  disabled={locked}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  rows={3}
                  placeholder="Contoh: sakit / musafir / dll"
                />
              </div>
            ) : null}

            {locked ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-bold text-white/80">Check-in terkunci</p>
                <p className="mt-1 text-sm text-white/60">
                  Kamu sudah check-in untuk tanggal {dateISO}.
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Status: <span className="font-semibold">{existing?.status === "fasting" ? "Puasa" : "Tidak Puasa"}</span>
                </p>
              </div>
            ) : null}

            {submitError ? (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">
                {submitError}
              </div>
            ) : null}

            {submitted ? (
              <div className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-4 text-emerald-100">
                Check-in tersimpan untuk {dateISO}.
              </div>
            ) : null}

            <button
              type="button"
              disabled={locked}
              onClick={onSubmit}
              className={`rounded-2xl px-5 py-3 text-sm font-black transition-colors ${
                locked
                  ? "bg-white/10 text-white/40 cursor-not-allowed"
                  : "bg-emerald-400 text-emerald-950 hover:bg-emerald-300"
              }`}
            >
              Simpan check-in
            </button>

            <p className="text-xs text-white/45">
              Catatan: data disimpan di localStorage browser kamu (device per device).
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
