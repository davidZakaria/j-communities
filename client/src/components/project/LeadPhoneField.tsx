import { useMemo, type RefObject } from "react";
import {
  COUNTRY_DIAL_CODES,
  DEFAULT_COUNTRY_ISO,
  getCountryDialCode,
  type CountryDialCode,
} from "../../config/countryDialCodes";

interface LeadPhoneFieldProps {
  id: string;
  countryName?: string;
  phoneName?: string;
  countryIso: string;
  onCountryChange: (iso: string) => void;
  disabled?: boolean;
  phoneInputRef?: RefObject<HTMLInputElement | null>;
}

function digitHint(country: CountryDialCode) {
  return country.minDigits === country.maxDigits
    ? `${country.maxDigits} digits`
    : `${country.minDigits}–${country.maxDigits} digits`;
}

export function LeadPhoneField({
  id,
  countryName = "countryCode",
  phoneName = "phone",
  countryIso,
  onCountryChange,
  disabled = false,
  phoneInputRef,
}: LeadPhoneFieldProps) {
  const country = useMemo(() => getCountryDialCode(countryIso) ?? getCountryDialCode(DEFAULT_COUNTRY_ISO)!, [countryIso]);

  return (
    <div>
      <label htmlFor={id} className="project-body-font project-text-muted mb-1.5 block text-[10px] uppercase tracking-[0.16em]">
        Phone number
      </label>
      <div className="flex gap-2">
        <select
          name={countryName}
          value={countryIso}
          disabled={disabled}
          onChange={(e) => onCountryChange(e.target.value)}
          aria-label="Country code"
          className="project-body-font min-w-[118px] shrink-0 border border-[var(--project-border)] bg-[var(--project-bg)] px-2 py-3 text-sm text-[var(--project-text)] outline-none focus:border-[var(--project-accent)] disabled:opacity-60 sm:min-w-[132px]"
        >
          {COUNTRY_DIAL_CODES.map((item) => (
            <option key={item.iso} value={item.iso}>
              {item.dialCode} {item.name}
            </option>
          ))}
        </select>
        <input
          ref={phoneInputRef}
          id={id}
          name={phoneName}
          type="tel"
          inputMode="numeric"
          required
          autoComplete="tel-national"
          disabled={disabled}
          maxLength={country.maxDigits}
          placeholder={digitHint(country)}
          className="project-body-font min-w-0 flex-1 border border-[var(--project-border)] bg-[var(--project-bg)] px-4 py-3 text-sm text-[var(--project-text)] outline-none focus:border-[var(--project-accent)] disabled:opacity-60"
        />
      </div>
      <p className="project-body-font project-text-muted mt-1.5 text-[10px] tracking-wide">
        Enter {digitHint(country)} without the country code ({country.dialCode}).
      </p>
    </div>
  );
}
