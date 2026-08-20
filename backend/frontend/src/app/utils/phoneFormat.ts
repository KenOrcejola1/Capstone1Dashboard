import { AsYouType, getCountryCallingCode, type CountryCode } from 'libphonenumber-js';

// Default "(XXX) XXX-XXXX" shape, assuming a 3-digit area code - the common
// case (matches most PH landline codes outside Metro Manila, and reads the
// same as most countries' local conventions).
function defaultTelephoneMask(digits: string): string {
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

// Live-formats a telephone number as the user types into a uniform
// "(XXX) XXX-XXXX"-style pattern - the same punctuation shape for every
// country, rather than each country's own real national convention (that
// approach was tried and rejected: it made Philippines numbers look
// different from every other country's, e.g. a plain space instead of a
// dash).
//
// The 3-digit area code is only a default, not a requirement: some area
// codes are shorter (e.g. Metro Manila's "02" is 2 digits). If the alumnus
// manually types ")" themselves right after a different number of digits,
// that's respected as their intended area-code length instead of being
// forced back to 3 - the remaining digits are still grouped with a dash
// before the last 4 digits.
export function formatTelephoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';

  const closeIndex = value.indexOf(')');
  if (closeIndex !== -1) {
    const areaDigits = value.slice(0, closeIndex).replace(/\D/g, '');
    if (areaDigits.length > 0 && areaDigits.length !== 3) {
      const rest = digits.slice(areaDigits.length);
      if (rest.length === 0) return `(${areaDigits})`;
      if (rest.length <= 4) return `(${areaDigits}) ${rest}`;
      const splitPoint = rest.length - 4;
      return `(${areaDigits}) ${rest.slice(0, splitPoint)}-${rest.slice(splitPoint)}`;
    }
  }

  return defaultTelephoneMask(digits);
}

// Live-formats a mobile number as the user types. If the value carries a
// leading "+" (e.g. a country's dial code was prefilled), it's formatted as
// a full international number; otherwise it's formatted using the given
// country's national format.
export function formatMobileNumber(value: string, countryCode?: CountryCode): string {
  const hasPlus = value.trim().startsWith('+');
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const formatter = hasPlus ? new AsYouType() : new AsYouType(countryCode);
  return formatter.input(hasPlus ? `+${digits}` : digits);
}

// Returns "+<calling code>" for a country (e.g. "+63" for PH), or '' if the
// country code is unknown/unsupported. Never throws.
export function getDialCode(countryCode?: string): string {
  if (!countryCode) return '';
  try {
    return `+${getCountryCallingCode(countryCode as CountryCode)}`;
  } catch {
    return '';
  }
}
