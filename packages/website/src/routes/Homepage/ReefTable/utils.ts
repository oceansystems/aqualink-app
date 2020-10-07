export type Order = "asc" | "desc";

export type OrderKeys = "locationName" | "temp" | "depth" | "dhw" | "alert";

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  return b[orderBy] >= a[orderBy] ? 1 : -1;
}

export function getComparator(
  order: Order,
  orderBy: OrderKeys
): (
  a: {
    [key in OrderKeys]: number | string | null;
  },
  b: {
    [key in OrderKeys]: number | string | null;
  }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  return [...array].sort(comparator);
}
