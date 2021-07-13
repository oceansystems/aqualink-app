import requests from "../helpers/requests";
import {
  CollectionDetailsResponse,
  CollectionSummary,
  CollectionUpdateParams,
} from "../store/Collection/types";

const getCollections = (token?: string) =>
  requests.send<CollectionSummary[]>({
    method: "GET",
    url: "collections",
    token,
  });

const getPublicCollection = (id: number) =>
  requests.send<CollectionDetailsResponse>({
    method: "GET",
    url: `collections/public/${id}`,
  });

const getHeatStressCollection = () =>
  requests.send<CollectionDetailsResponse>({
    method: "GET",
    url: "collections/heat-stress-tracker",
  });

const getCollection = (id: number, token?: string) =>
  requests.send<CollectionDetailsResponse>({
    method: "GET",
    url: `collections/${id}`,
    token,
  });

const updateCollection = (
  { id, name, addReefIds, removeReefIds }: CollectionUpdateParams,
  token?: string
) =>
  requests.send({
    method: "PUT",
    url: `collections/${id}`,
    data: { name, addReefIds, removeReefIds },
    token,
  });

export default {
  getCollections,
  getPublicCollection,
  getHeatStressCollection,
  getCollection,
  updateCollection,
};
