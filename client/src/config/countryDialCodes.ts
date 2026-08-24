export {
  COUNTRY_DIAL_CODES,
  DEFAULT_COUNTRY_ISO,
  countPhoneDigits,
  formatFullPhone,
  getCountryDialCode,
  validateLocalPhone,
} from "../../../shared/countryDialCodes.js";

export type CountryDialCode = {
  iso: string;
  name: string;
  dialCode: string;
  minDigits: number;
  maxDigits: number;
};
