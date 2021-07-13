import React, { useEffect } from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Container,
  Grid,
  Box,
  Typography,
  LinearProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useSelector, useDispatch } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";

import ReefNavBar from "../../../common/NavBar";
import ReefFooter from "../../../common/Footer";
import SiteDetails from "../../../common/SiteDetails";
import ReefInfo from "./ReefInfo";
import {
  reefDetailsSelector,
  reefLoadingSelector,
  reefErrorSelector,
  reefRequest,
  reefTimeSeriesDataRangeRequest,
  clearTimeSeriesData,
  clearTimeSeriesDataRange,
  reefOceanSenseDataRequest,
} from "../../../store/Reefs/selectedReefSlice";
import {
  surveysRequest,
  surveyListSelector,
} from "../../../store/Survey/surveyListSlice";
import { sortByDate } from "../../../helpers/sortDailyData";
import { userInfoSelector } from "../../../store/User/userSlice";
import { isAdmin } from "../../../helpers/user";
import { findAdministeredReef } from "../../../helpers/findAdministeredReef";
import { User } from "../../../store/User/types";
import { findClosestSurveyPoint } from "../../../helpers/map";
import { localizedEndOfDay } from "../../../common/Chart/MultipleSensorsCharts/helpers";
import { subtractFromDate } from "../../../helpers/dates";
import { oceanSenseConfig } from "../../../constants/oceanSenseConfig";

const getAlertMessage = (
  user: User | null,
  reefId: string,
  hasDailyData: boolean
) => {
  const userReef = findAdministeredReef(user, parseInt(reefId, 10));
  const { applied, status } = userReef || {};
  const isSiteAdmin = isAdmin(user, parseInt(reefId, 10));

  const defaultMessage =
    "Currently no Smart Buoy deployed at this reef location. Real-time values are derived from a combination of NOAA satellite readings and weather models.";

  switch (true) {
    case !isSiteAdmin:
      return defaultMessage;

    case !hasDailyData:
      return "Welcome to your virtual reef, data is loading, please come back in a few hours. This site will be visible publicly as soon as it has been approved by the Aqualink team.";

    case !applied:
      return (
        <div>
          {defaultMessage} Apply for an Aqualink Smart Buoy
          <span> </span> <Link to={`/reefs/${reefId}/apply`}>here</Link>.
        </div>
      );

    case status === "in_review":
      return (
        <div>
          {defaultMessage} Your application for an Aqualink Smart Buoy is being
          reviewed. You can check your application<span> </span>
          <Link to={`/reefs/${reefId}/apply`}>here</Link>.
        </div>
      );

    case status === "approved":
      return "Your application for an Aqualink Smart Buoy has been approved.";

    case status === "shipped":
      return "Your Smart Buoy is on its way! Mark it as 'deployed' once it's installed to access its data.";

    case status === "rejected":
      return (
        <div>
          Your application for an Aqualink Smart Buoy was not approved at this
          time. For more information, you can contact<span> </span>
          <a href="mailto:info@aqualink.org">info@aqualink.org</a>
        </div>
      );

    default:
      return defaultMessage;
  }
};

const Reef = ({ match, classes }: ReefProps) => {
  const reefDetails = useSelector(reefDetailsSelector);
  const user = useSelector(userInfoSelector);
  const loading = useSelector(reefLoadingSelector);
  const error = useSelector(reefErrorSelector);
  const surveyList = useSelector(surveyListSelector);
  const dispatch = useDispatch();
  const reefId = match.params.id;
  const { id, liveData, dailyData, surveyPoints, polygon, timezone } =
    reefDetails || {};

  const featuredMedia = sortByDate(surveyList, "diveDate", "desc").find(
    (survey) =>
      survey.featuredSurveyMedia && survey.featuredSurveyMedia.type === "image"
  );

  const { id: featuredSurveyId, featuredSurveyMedia, diveDate } =
    featuredMedia || {};
  const { poi: featuredSurveyPoint, url } = featuredSurveyMedia || {};

  const closestSurveyPointId = findClosestSurveyPoint(polygon, surveyPoints);

  const hasSpotterData = Boolean(liveData?.topTemperature);

  const hasDailyData = Boolean(dailyData && dailyData.length > 0);

  const today = localizedEndOfDay(undefined, timezone);

  // Fetch reef and surveys
  useEffect(() => {
    dispatch(reefRequest(reefId));
    dispatch(surveysRequest(reefId));

    return () => {
      dispatch(clearTimeSeriesDataRange());
      dispatch(clearTimeSeriesData());
    };
  }, [dispatch, reefId]);

  // Fetch time series data range for the reef's closest survey point
  // once the survey points are successfully fetched
  useEffect(() => {
    if (reefId === id?.toString()) {
      dispatch(
        reefTimeSeriesDataRangeRequest({
          reefId,
          pointId: closestSurveyPointId ? `${closestSurveyPointId}` : undefined,
        })
      );
    }
  }, [closestSurveyPointId, dispatch, id, reefId]);

  useEffect(() => {
    if (id && oceanSenseConfig?.[id] && reefId === id.toString()) {
      dispatch(
        reefOceanSenseDataRequest({
          sensorID: "oceansense-2",
          startDate: subtractFromDate(today, "month", 6),
          endDate: today,
          latest: true,
        })
      );
    }
  }, [dispatch, id, reefId, today]);

  if (loading || (!reefDetails && !error)) {
    return (
      <>
        <ReefNavBar searchLocation={false} />
        <LinearProgress />
      </>
    );
  }

  return (
    <>
      <ReefNavBar searchLocation />
      <Container className={!hasDailyData ? classes.noDataWrapper : ""}>
        {reefDetails && liveData && !error ? (
          <>
            <ReefInfo
              hasDailyData={hasDailyData}
              reef={reefDetails}
              lastSurvey={surveyList[surveyList.length - 1]?.diveDate}
              isAdmin={isAdmin(user, parseInt(reefId, 10))}
            />
            {!hasSpotterData && (
              <Box mt="1.3rem">
                <Alert severity="info">
                  {getAlertMessage(user, reefId, hasDailyData)}
                </Alert>
              </Box>
            )}
            <SiteDetails
              reef={{
                ...reefDetails,
                featuredImage: url,
              }}
              closestSurveyPointId={
                closestSurveyPointId ? `${closestSurveyPointId}` : undefined
              }
              featuredSurveyId={featuredSurveyId}
              hasDailyData={hasDailyData}
              surveys={surveyList}
              featuredSurveyPoint={featuredSurveyPoint}
              surveyDiveDate={diveDate}
            />
          </>
        ) : (
          <Container className={classes.noData}>
            <Grid container direction="column" alignItems="center">
              <Grid item>
                <Typography gutterBottom color="primary" variant="h2">
                  No Data Found
                </Typography>
              </Grid>
            </Grid>
          </Container>
        )}
      </Container>
      <ReefFooter />
    </>
  );
};

const styles = () =>
  createStyles({
    noData: {
      display: "flex",
      alignItems: "center",
      height: "80vh",
    },
    noDataWrapper: {
      height: "100%",
    },
  });

interface MatchProps extends RouteComponentProps<{ id: string }> {}

type ReefProps = WithStyles<typeof styles> & MatchProps;

export default withStyles(styles)(Reef);
