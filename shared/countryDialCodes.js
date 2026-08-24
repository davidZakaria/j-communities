/** @typedef {{ iso: string, name: string, dialCode: string, minDigits: number, maxDigits: number }} CountryDialCode */

/** @type {CountryDialCode[]} */
export const COUNTRY_DIAL_CODES = [
  { iso: "EG", name: "Egypt", dialCode: "+20", minDigits: 10, maxDigits: 10 },
  { iso: "SA", name: "Saudi Arabia", dialCode: "+966", minDigits: 9, maxDigits: 9 },
  { iso: "AE", name: "United Arab Emirates", dialCode: "+971", minDigits: 9, maxDigits: 9 },
  { iso: "KW", name: "Kuwait", dialCode: "+965", minDigits: 8, maxDigits: 8 },
  { iso: "QA", name: "Qatar", dialCode: "+974", minDigits: 8, maxDigits: 8 },
  { iso: "BH", name: "Bahrain", dialCode: "+973", minDigits: 8, maxDigits: 8 },
  { iso: "OM", name: "Oman", dialCode: "+968", minDigits: 8, maxDigits: 8 },
  { iso: "JO", name: "Jordan", dialCode: "+962", minDigits: 9, maxDigits: 9 },
  { iso: "LB", name: "Lebanon", dialCode: "+961", minDigits: 7, maxDigits: 8 },
  { iso: "IQ", name: "Iraq", dialCode: "+964", minDigits: 10, maxDigits: 10 },
  { iso: "LY", name: "Libya", dialCode: "+218", minDigits: 9, maxDigits: 9 },
  { iso: "MA", name: "Morocco", dialCode: "+212", minDigits: 9, maxDigits: 9 },
  { iso: "TN", name: "Tunisia", dialCode: "+216", minDigits: 8, maxDigits: 8 },
  { iso: "US", name: "United States", dialCode: "+1", minDigits: 10, maxDigits: 10 },
  { iso: "GB", name: "United Kingdom", dialCode: "+44", minDigits: 10, maxDigits: 10 },
  { iso: "FR", name: "France", dialCode: "+33", minDigits: 9, maxDigits: 9 },
  { iso: "DE", name: "Germany", dialCode: "+49", minDigits: 10, maxDigits: 11 },
  { iso: "IT", name: "Italy", dialCode: "+39", minDigits: 9, maxDigits: 10 },
  { iso: "IN", name: "India", dialCode: "+91", minDigits: 10, maxDigits: 10 },
  { iso: "PK", name: "Pakistan", dialCode: "+92", minDigits: 10, maxDigits: 10 },
];

export const DEFAULT_COUNTRY_ISO = "EG";

const byIso = new Map(COUNTRY_DIAL_CODES.map((country) => [country.iso, country]));

export function getCountryDialCode(iso) {
  return byIso.get(String(iso ?? "").trim().toUpperCase()) ?? null;
}

export function countPhoneDigits(value) {
  return (String(value ?? "").match(/\d/g) || []).length;
}

export function formatFullPhone(countryIso, localPhone) {
  const country = getCountryDialCode(countryIso);
  if (!country) return null;
  const digits = String(localPhone ?? "").replace(/\D/g, "");
  if (!digits) return null;
  return `${country.dialCode}${digits}`;
}

export function validateLocalPhone(countryIso, localPhone) {
  const country = getCountryDialCode(countryIso);
  if (!country) return { ok: false, error: "Invalid country code." };

  const digits = String(localPhone ?? "").replace(/\D/g, "");
  if (!digits) return { ok: false, error: "Please enter your phone number." };

  if (digits.length < country.minDigits || digits.length > country.maxDigits) {
    const label =
      country.minDigits === country.maxDigits
        ? `${country.maxDigits} digits`
        : `${country.minDigits}–${country.maxDigits} digits`;
    return { ok: false, error: `Phone number must be ${label} for ${country.name}.` };
  }

  return { ok: true, country, digits, fullPhone: `${country.dialCode}${digits}` };
}
