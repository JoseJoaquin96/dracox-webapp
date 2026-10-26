// src/app/shared/format.ts
var numberFormat = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 });
var shortDateFormat = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" });
var dateTimeFormat = new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short" });
function formatNumber(value) {
  return numberFormat.format(value);
}
function formatShortDate(value) {
  return shortDateFormat.format(new Date(value));
}
function formatDateTime(value) {
  return dateTimeFormat.format(new Date(value));
}
function formatClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
function formatPosition(index) {
  return String(index + 1).padStart(2, "0");
}
function plural(count, singular, pluralForm = `${singular}s`) {
  return count === 1 ? singular : pluralForm;
}

export {
  formatNumber,
  formatShortDate,
  formatDateTime,
  formatClock,
  formatPosition,
  plural
};
//# sourceMappingURL=chunk-OKXU5PZQ.js.map
