/**
 * Money display. Every amount the API sends is an INTEGER in the currency's
 * minor unit (pesewas, cents); it is divided by 100 exactly once, here, at the
 * display boundary.
 */

/** The platform's base currency — what the backend falls back to when a record names none. */
export const PLATFORM_BASE_CURRENCY = "GHS";

/**
 * Format an amount in integer minor units, e.g. 12550 GHS → "GH₵125.50".
 * Intl picks the symbol and its placement for the locale; nothing is hard-coded.
 * A missing currency means the backend's fallback (GHS), never USD.
 */
export function formatMinorUnits(
  amountMinor: number,
  currency: string | null | undefined,
  locale?: string,
): string {
  const code = (currency ?? "").trim().toUpperCase() || PLATFORM_BASE_CURRENCY;
  const major = amountMinor / 100;
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency: code }).format(major);
  } catch {
    // Intl throws on a code it doesn't know; still show the amount and the code.
    return `${major.toFixed(2)} ${code}`;
  }
}
