import { SurveyListState, Observations } from "../../../../store/Survey/types";
import { sortByDate } from "../../../../helpers/sortDailyData";

const filterSurveys = (
  list: SurveyListState["list"],
  observation: Observations | "any",
  point: number
): SurveyListState["list"] => {
  const sortedSurveys = sortByDate(list, "diveDate", "desc");

  if (observation === "any" && point === -1) {
    return sortedSurveys;
  }
  if (observation === "any") {
    return sortedSurveys.filter((survey) =>
      survey.surveyPoints?.includes(point)
    );
  }
  if (point === -1) {
    return sortedSurveys.filter((survey) =>
      survey.observations?.includes(observation)
    );
  }
  return sortedSurveys.filter(
    (survey) =>
      survey.observations?.includes(observation) &&
      survey.surveyPoints?.includes(point)
  );
};

export default filterSurveys;
