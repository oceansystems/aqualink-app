interface DiveLocation {
  lat: number;
  lng: number;
}

interface publicUser {
  id: number;
  fullName?: string;
}

export type Observations =
  | "healthy"
  | "possible-disease"
  | "evident-disease"
  | "mortality"
  | "environmental"
  | "anthropogenic";

type WeatherConditions = "calm" | "waves" | "storm";

export interface SurveyMedia {
  id: number;
  url: string;
  featured: boolean;
  observations: Observations;
  comments: string | null;
  type: "image" | "video";
  poiId?: SurveyPoint;
}

export interface SurveyMediaUpdateRequestData {
  featured?: boolean;
  hidden?: boolean;
  observations?: Observations;
  comments?: string;
  poiId?: SurveyPoint;
}
export interface SurveyPoint {
  id?: number;
  name: string;
  surveyMedia: SurveyMedia[];
}

export interface SurveyState {
  id?: number;
  diveLocation?: DiveLocation | null;
  diveDate?: string | null;
  weatherConditions?: WeatherConditions;
  comments?: string;
  temperature?: number;
  userId?: publicUser;
  surveyMedia?: SurveyMedia[];
  featuredSurveyMedia?: SurveyMedia;
}

export interface SurveyListItem {
  id?: number;
  diveLocation?: DiveLocation | null;
  diveDate?: string | null;
  weatherConditions?: WeatherConditions;
  observations: Observations[];
  comments?: string;
  temperature?: number;
  userId?: publicUser;
  surveyPoints?: number[];
  featuredSurveyMedia?: SurveyMedia;
}

export interface SurveyData {
  reef: number;
  diveDate: string;
  diveLocation?: DiveLocation | null;
  weatherConditions: WeatherConditions;
  comments?: string;
  token?: string | null;
}

export interface SurveyMediaData {
  url: string;
  poiId?: number;
  observations: Observations | null;
  comments?: string;
  metadata?: string;
  token?: string | null;
  featured: boolean;
  hidden: boolean;
}

export interface SurveyListState {
  list: SurveyListItem[];
  loading: boolean;
  error?: string | null;
}

export interface SelectedSurveyState {
  details?: SurveyState;
  loading: boolean;
  error?: string | null;
}
