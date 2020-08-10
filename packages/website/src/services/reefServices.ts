import requests from "../helpers/requests";
import type { Data, Reef } from "../store/Reefs/types";

const getReef = (id: string) =>
  requests.send<Reef>({
    url: `reefs/${id}`,
    method: "GET",
  });

const getReefDailyData = (id: string) =>
  requests.send<Data[]>({
    url: `reefs/${id}/daily_data`,
    method: "GET",
  });

const getReefs = () =>
  requests.send<Reef[]>({
    url: "reefs",
    method: "GET",
  });

export default {
  getReef,
  getReefs,
  getReefDailyData,
};
