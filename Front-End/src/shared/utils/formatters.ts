/**
 * Format helper functions for currency and date/time.
 */

/**
 * Formats a numeric value to BRL currency string (e.g. R$ 1.250,00).
 */
export const formatBRL = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formats an ISO date string to a localized Brazilian format (dd/MM/yyyy or custom options).
 * Automatically accounts for timezone offset on date-only (10 character) strings.
 */
export const formatDateBR = (dateStr: string, options?: Intl.DateTimeFormatOptions): string => {
  const d = new Date(dateStr);
  if (dateStr.length === 10) {
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  }
  return d.toLocaleDateString('pt-BR', options);
};

export const formatMonthYear = (month: number, year: number): string => {
  const date = new Date(year, month);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};

export const getCurrentMonth = () => {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
};

export const isSameMonth = (dateStr: string, month: number, year: number): boolean => {
  const d = new Date(dateStr);
  if (dateStr.length === 10) {
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  }
  return d.getMonth() === month && d.getFullYear() === year;
};
