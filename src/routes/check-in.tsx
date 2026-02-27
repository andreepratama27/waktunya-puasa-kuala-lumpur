import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useId, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  addDaysISO,
  formatDateISOInTimeZone,
  getUserTimeZone,
} from "@/lib/dateIso";
import { useConvexUrl } from "@/lib/convex";

export const Route = createFileRoute("/check-in")({
  component: CheckInPage,
});

const CURRENT_YEAR = new Date().getFullYear();

type DayChoice = "today" | "yesterday";

type StatusChoice = "fasting" | "not_fasting";

function CheckInPage() {
  const convexUrl = useConvexUrl();

  const tz = useMemo(() => getUserTimeZone(), []);
  const todayISO = formatDateISOInTimeZone(new Date(), tz);
  const yesterdayISO = addDaysISO(todayISO, -1);

  const [dayChoice, setDayChoice] = useState<DayChoice>("today");
  const [status, setStatus] = useState<StatusChoice>("fasting");
  const [reason, setReason] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const dateISO = dayChoice === "today" ? todayISO : yesterdayISO;

  if (!convexUrl) {
    return (
      <main className="page-wrap pb-10 text-white">
        <div className="mx-auto max-w-3xl px-5 pt-8 sm:px-8">
          <div className="frost-card rounded-2xl border border-amber-400/40 bg-amber-500/10 p-6">
            <p className="text-xs font-bold tracking-[0.12em] text-amber-200 uppercase">
              Puasa Tracker
            </p>
            <h1 className="mt-2 text-3xl font-black">Convex belum dikonfigurasi</h1>
            <p className="mt-3 text-white/70">
              Set environment variable <code className="text-white">VITE_CONVEX_URL</code> dulu
              supaya check-in bisa disimpan secara persistent.
            </p>
            <div className="mt-5">
              <Link
                to="/"
                className="text-emerald-300 hover:text-emerald-200 transition-colors"
              >
                ← Balik ke homepage
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return <CheckInPageWithConvex tz={tz} todayISO={todayISO} yesterdayISO={yesterdayISO} dateISO={dateISO} dayChoice={dayChoice} setDayChoice={setDayChoice} status={status} setStatus={setStatus} reason={reason} setReason={setReason} submitError={submitError} setSubmitError={setSubmitError} submitted={submitted} setSubmitted={setSubmitted} />;
}

function CheckInPageWithConvex(props: {
  tz: string;
  todayISO: string;
  yesterdayISO: string;
  dateISO: string;
  dayChoice: DayChoice;
  setDayChoice: (v: DayChoice) => void;
  status: StatusChoice;
  setStatus: (v: StatusChoice) => void;
  reason: string;
  setReason: (v: string) => void;
  submitError: string | null;
  setSubmitError: (v: string | null) => void;
  submitted: boolean;
  setSubmitted: (v: boolean) => void;
}) {
  const seed = useMutation(api.puasa.seedRamadanDays);
  const submit = useMutation(api.puasa.submitCheckin);

  const existing = useQuery(api.puasa.getCheckin, {
    year: CURRENT_YEAR,
    dateISO: props.dateISO,
  });

  useEffect(() => {
    void seed({ year: CURRENT_YEAR });
  }, [seed]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset UI state whenever the selected date changes
	useEffect(() => {
		props.setSubmitted(false);
		props.setSubmitError(null);
	}, [props.dateISO]);

  const locked = existing !== undefined && existing !== null;
	const reasonId = useId();

  const onSubmit = async () => {
    props.setSubmitError(null);

    const trimmed = props.reason.trim();
    if (props.status === "not_fasting" && trimmed.length < 5) {
      props.setSubmitError("Alasan minimal 5 karakter.");
      return;
    }

    const result = await submit({
      year: CURRENT_YEAR,
      dateISO: props.dateISO,
      status: props.status,
      reason: props.status === "not_fasting" ? trimmed : undefined,
    });

    if (!result.ok) {
      if (result.reason === "locked") {
        props.setSubmitError("Check-in untuk tanggal ini sudah dikunci.");
        return;
      }
      if (result.reason === "reason_too_short") {
        props.setSubmitError("Alasan minimal 5 karakter.");
        return;
      }
      props.setSubmitError("Gagal simpan check-in.");
      return;
    }

    props.setSubmitted(true);
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
          <p className="mt-1 font-semibold text-white/85">{props.tz}</p>

          <div className="mt-6 grid gap-4">
            <div>
              <p className="text-sm font-semibold">Tanggal check-in</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => props.setDayChoice("today")}
                  className={`rounded-full px-4 py-2 text-sm font-bold border transition-colors ${
                    props.dayChoice === "today"
                      ? "border-emerald-300 bg-emerald-500/15 text-emerald-100"
                      : "border-white/10 text-white/70 hover:text-white"
                  } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  Hari ini ({props.todayISO})
                </button>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => props.setDayChoice("yesterday")}
                  className={`rounded-full px-4 py-2 text-sm font-bold border transition-colors ${
                    props.dayChoice === "yesterday"
                      ? "border-emerald-300 bg-emerald-500/15 text-emerald-100"
                      : "border-white/10 text-white/70 hover:text-white"
                  } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  Kemarin ({props.yesterdayISO})
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Status</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => props.setStatus("fasting")}
                  className={`rounded-full px-4 py-2 text-sm font-bold border transition-colors ${
                    props.status === "fasting"
                      ? "border-emerald-300 bg-emerald-400 text-emerald-950"
                      : "border-white/10 text-white/70 hover:text-white"
                  } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  Puasa
                </button>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => props.setStatus("not_fasting")}
                  className={`rounded-full px-4 py-2 text-sm font-bold border transition-colors ${
                    props.status === "not_fasting"
                      ? "border-amber-300 bg-amber-500/20 text-amber-100"
                      : "border-white/10 text-white/70 hover:text-white"
                  } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  Tidak Puasa
                </button>
              </div>
            </div>

            {props.status === "not_fasting" ? (
              <div>
                <label className="text-sm font-semibold" htmlFor={reasonId}>
                  Alasan (min 5 karakter)
                </label>
                <textarea
                  id={reasonId}
                  disabled={locked}
                  value={props.reason}
                  onChange={(e) => props.setReason(e.target.value)}
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
                  Kamu sudah check-in untuk tanggal {props.dateISO}.
                </p>
                {existing?.status ? (
                  <p className="mt-2 text-sm text-white/70">
                    Status: <span className="font-semibold">{existing.status === "fasting" ? "Puasa" : "Tidak Puasa"}</span>
                  </p>
                ) : null}
              </div>
            ) : null}

            {props.submitError ? (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">
                {props.submitError}
              </div>
            ) : null}

            {props.submitted ? (
              <div className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-4 text-emerald-100">
                Check-in tersimpan untuk {props.dateISO}.
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
          </div>
        </section>
      </div>
    </main>
  );
}
