import requests from "../helpers/requests";

interface GetFormData {
  appId: string;
  fundingSource: string | null;
  installationResources: string | null;
  installationSchedule: string | null;
  permitRequirements: string | null;
  reef: {
    createdAt: string;
    depth: number;
    name: string;
    polygon: {
      coordinates: [number, number];
      type: string;
    };
    status: number;
    temperatureThreshold: number;
    updatedAt: string;
    videoStream: string;
  };
  user: {
    country: string | null;
    createdAt: string;
    description: string | null;
    email: string;
    firebaseUid: string;
    fullName: string;
    imageUrl: string | null;
    location: string | null;
    organization: string;
  };
}

export interface SendFormData {
  reef: {
    name: string;
    depth: number;
  };
  reefApplication: {
    permitRequirements: string | null;
    fundingSource: string | null;
    installationSchedule: string | null;
    installationResources: string | null;
  };
}

const getFormData = (appId: string, uid?: string) =>
  requests.send<GetFormData>({
    url: `/reef-applications/${appId}`,
    method: "GET",
    params: {
      uid,
    },
  });

const sendFormData = (appId: string, data: SendFormData) =>
  requests.send<SendFormData>({
    url: `reef-applications/${appId}`,
    method: "PUT",
    data,
  });

export default {
  getFormData,
  sendFormData,
};
