const numberFormat = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 });
const shortDateFormat = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' });
const dateTimeFormat = new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' });

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

export function formatShortDate(value: string | Date): string {
  return shortDateFormat.format(new Date(value));
}

export function formatDateTime(value: string | Date): string {
  return dateTimeFormat.format(new Date(value));
}

/** 95 → "01:35" */
export function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

/** 0 → "01" */
export function formatPosition(index: number): string {
  return String(index + 1).padStart(2, '0');
}

export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return count === 1 ? singular : pluralForm;
}
