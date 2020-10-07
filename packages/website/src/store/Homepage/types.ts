import { Reef } from "../Reefs/types";

export interface HomePageState {
  reefOnMap: Reef | null;
}

export interface TableRow {
  locationName: string | null;
  temp: number | null;
  maxMonthlyMean: number | null;
  depth: number | null;
  dhw: number | null;
  tableData: {
    id: number;
  };
  alertLevel: number | null;
  alert: string | null;
}
