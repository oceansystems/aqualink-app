import type { Data } from "../store/Reefs/types";

export const sortDailyData = (dailyData: Data[], order?: string) => {
  return Object.values(dailyData).sort((item1, item2) => {
    const date1 = new Date(item1.date).getTime();
    const date2 = new Date(item2.date).getTime();

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
