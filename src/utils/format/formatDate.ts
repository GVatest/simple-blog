export function formatDate(date: string) {
  var options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  } as Intl.DateTimeFormatOptions;

  return new Date(date).toLocaleDateString("en-US", options);
}
