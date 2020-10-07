import type { DailyData } from "../store/Reefs/types";

/** Utility function to get the closest available data given a date in UTC. */
export function getDailyDataClosestToDate(dailyData: DailyData[], date: Date) {
  const timeDiff = (incomingDate: string) =>
    Math.abs(new Date(incomingDate).getTime() - date.getTime());

  return dailyData.reduce((prevClosest, nextPoint) =>
    timeDiff(prevClosest.date) > timeDiff(nextPoint.date)
      ? nextPoint
      : prevClosest
  );
}

/** Utility function to sort data by date */
export const sortByDate = <T>(
  list: T[],
  dateFieldName: keyof T,
  order?: "asc" | "desc"
): T[] => {
  return Object.values(list).sort((item1, item2) => {
    const date1 = new Date(
      (item1[dateFieldName] as unknown) as string
    ).getTime();
    const date2 = new Date(
      (item2[dateFieldName] as unknown) as string
    ).getTime();

    switch (order) {
      case "desc":
        return date2 - date1;
      case "asc":
        return date1 - date2;
      default:
        return date1 - date2;
    }
  });
};
