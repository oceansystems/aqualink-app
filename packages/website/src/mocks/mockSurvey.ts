import { SurveyListItem } from "../store/Survey/types";

export const mockSurvey: SurveyListItem = {
  comments: "No comments",
  diveDate: "2020-09-10T10:27:00.000Z",
  id: 46,
  temperature: 10,
  weatherConditions: "calm",
  observations: ["anthropogenic"],
  userId: {
    id: 0,
    fullName: "Joe Doe",
  },
  featuredSurveyMedia: {
    comments: null,
    featured: true,
    id: 66,
    observations: "possible-disease",
    type: "image",
    imageUrl: "",
    thumbnailUrl: "",
  },
};
