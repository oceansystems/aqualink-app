import { AxiosRequestConfig } from "axios";
import requests from "../helpers/requests";
import type { DailyData, LiveData, Reef, Pois } from "../store/Reefs/types";

const getReef = (id: string) =>
  requests.send<Reef>({
    url: `reefs/${id}`,
    method: "GET",
  });

const getReefDailyData = (id: string) =>
  requests.send<DailyData[]>({
    url: `reefs/${id}/daily_data`,
    method: "GET",
  });

const getReefLiveData = (id: string) =>
  requests.send<LiveData>({
    url: `reefs/${id}/live_data`,
    method: "GET",
  });

const getReefs = () =>
  requests.send<Reef[]>({
    url: "reefs",
    method: "GET",
  });

const getReefPois = (
  id: string,
  cancelToken?: AxiosRequestConfig["cancelToken"]
) =>
  requests.send<Pois[]>({
    url: `pois?reef=${id}`,
    method: "GET",
    cancelToken,
  });

const deleteReefPoi = (id: number, token: string) =>
  requests.send({
    url: `pois/${id}`,
    method: "DELETE",
    token,
  });

export default {
  getReef,
  getReefs,
  getReefDailyData,
  getReefLiveData,
  getReefPois,
  deleteReefPoi,
};
