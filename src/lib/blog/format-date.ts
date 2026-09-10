/** Suomalainen päivämäärämuoto artikkeleille, esim. "3. elokuuta 2026". */
const dateFormatter = new Intl.DateTimeFormat("fi-FI", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Helsinki",
});

export function formatArticleDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T12:00:00+02:00`));
}
