/** Format integer paise as a localized currency string (default INR). */
export function formatPaise(paise: number, currency = 'INR', locale = 'en-IN'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(paise / 100)
}
