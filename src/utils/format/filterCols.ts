export function filterCols(
  oldValues: { [key: string]: any },
  newValues: { [key: string]: any }
) {
  return Object.entries(newValues).filter(([key, value]) => {
    if (key in oldValues) {
      return oldValues[key] !== value;
    }
  });
}
