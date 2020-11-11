import { groupBy, sortBy } from "lodash";
import type { SurveyMedia } from "../store/Survey/types";

export const getFeaturedMedia = (surveyMedia: SurveyMedia[]) => {
  const media = surveyMedia.find((mediaItem) => mediaItem.featured);
  return media?.thumbnailUrl || media?.imageUrl;
};

export const getNumberOfImages = (surveyMedia: SurveyMedia[]) => {
  return surveyMedia.filter((media) => media.type === "image").length;
};

export const getNumberOfVideos = (surveyMedia: SurveyMedia[]) => {
  return surveyMedia.filter((media) => media.type === "video").length;
};

export const getSurveyPointNames = (surveyMedia: SurveyMedia[]) => {
  return [...new Set(surveyMedia.map((media) => media.poiId?.name))].filter(
    (value) => value
  );
};

export const getNumberOfSurveyPoints = (surveyMedia: SurveyMedia[]) => {
  return getSurveyPointNames(surveyMedia).length;
};

export const getSurveyPointsByName = (surveyMedia: SurveyMedia[]) => {
  const sortedByPoiName = sortBy(surveyMedia, (media) => media.poiId?.name);
  const groupedMedia = groupBy(
    sortedByPoiName.map((media) => ({
      ...media,
      poiName: media.poiId?.name || "Other",
    })),
    "poiName"
  );
  return Object.entries(groupedMedia).map(([name, pointSurveyMedia]) => ({
    name,
    surveyMedia: pointSurveyMedia,
  }));
};
