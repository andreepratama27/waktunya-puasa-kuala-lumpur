export const DEFAULT_TIMEZONE = "Asia/Kuala_Lumpur";

const isValidTimeZone = (timeZone: string) => {
  try {
    // Throws RangeError for invalid tz in many JS engines.
    new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
    return true;
  } catch {
    return false;
  }
};

export const getUserTimeZone = () => {
  // During SSR we don't have the user's browser timezone.
  // Use a stable default to avoid hydration / runtime errors.
  if (typeof window === "undefined") return DEFAULT_TIMEZONE;

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && isValidTimeZone(tz)) return tz;
    return DEFAULT_TIMEZONE;
  } catch {
    return DEFAULT_TIMEZONE;
  }
};

export const formatDateISOInTimeZone = (date: Date, timeZone: string) => {
  const safeTz = isValidTimeZone(timeZone) ? timeZone : DEFAULT_TIMEZONE;

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: safeTz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${lookup.year}-${lookup.month}-${lookup.day}`;
};

export const addDaysISO = (dateISO: string, days: number) => {
  const [y, m, d] = dateISO.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  const yyyy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
