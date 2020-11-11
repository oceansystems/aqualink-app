/* eslint-disable no-nested-ternary */
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
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
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { Alert } from "@material-ui/lab";
import { useSelector, useDispatch } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";

import ReefNavBar from "../../../common/NavBar";
import ReefFooter from "../../../common/Footer";
import ReefInfo from "./ReefInfo";
import {
  reefDetailsSelector,
  reefLoadingSelector,
  reefErrorSelector,
  reefRequest,
  reefSpotterDataRequest,
  reefSpotterDataSelector,
  clearReefSpotterData,
} from "../../../store/Reefs/selectedReefSlice";
import {
  surveysRequest,
  surveyListSelector,
} from "../../../store/Survey/surveyListSlice";
import ReefDetails from "./ReefDetails";
import { sortByDate } from "../../../helpers/sortDailyData";
import { userInfoSelector } from "../../../store/User/userSlice";
import { isAdmin } from "../../../helpers/isAdmin";
import { findAdministeredReef } from "../../../helpers/findAdministeredReef";
import { User } from "../../../store/User/types";
import {
  subtractFromDate,
  findMaxDate,
  findChartPeriod,
} from "../../../helpers/dates";
import { Range } from "../../../store/Reefs/types";

const getAlertMessage = (
  user: User | null,
  reefId: string,
  hasDailyData: boolean
) => {
  const userReef = findAdministeredReef(user, parseInt(reefId, 10));
  const { applied, status } = userReef || {};
  const isManager = isAdmin(user, parseInt(reefId, 10));

  const defaultMessage =
    "Currently no Smart Buoy deployed at this reef location. All values are derived from a combination of NOAA satellite readings and weather models.";

  switch (true) {
    case !isManager:
      return defaultMessage;

    case !hasDailyData:
      return "Welcome to your virtual reef, data is loading, please come back in a few hours. This site will be visible publicly as soon as it has been approved by the Aqualink team.";

    case !applied:
      return (
        <div>
          {defaultMessage} Apply for an Aqualink Smart Buoy
          <span> </span> <Link to="/apply">here</Link>.
        </div>
      );

    case status === "in_review":
      return (
        <div>
          {defaultMessage} Your application for an Aqualink Smart Buoy is being
          reviewed. You can check your application<span> </span>
          <Link to="/apply">here</Link>.
        </div>
      );

    case status === "approved":
      return "Your application for an Aqualink Smart Buoy has been approved.";

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

  const featuredMedia = sortByDate(surveyList, "diveDate", "desc").find(
    (survey) =>
      survey.featuredSurveyMedia && survey.featuredSurveyMedia.type === "image"
  );

  const { featuredSurveyMedia, diveDate } = featuredMedia || {};
  const { poiId, imageUrl } = featuredSurveyMedia || {};

  const { liveData, dailyData } = reefDetails || {};

  const hasSpotter = Boolean(liveData?.surfaceTemperature);

  const hasDailyData = Boolean(dailyData && dailyData.length > 0);

  const spotterData = useSelector(reefSpotterDataSelector);
  const [range, setRange] = useState<Range>("week");
  const today = new Date();
  const [endDate, setEndDate] = useState<string>();
  const [pickerDate, setPickerDate] = useState<string>(today.toISOString());

  // fetch the reef and spotter data
  useEffect(() => {
    dispatch(reefRequest(reefId));
    dispatch(surveysRequest(reefId));
  }, [dispatch, reefId]);

  // fetch spotter data from api, also filter the range we're interested in.
  useEffect(() => {
    if (hasSpotter) {
      dispatch(
        reefSpotterDataRequest({
          id: reefId,
          startDate: subtractFromDate(pickerDate, range),
          endDate: pickerDate,
        })
      );
    } else {
      // Clear possible spotter data from previously selected reef
      dispatch(clearReefSpotterData());
    }
  }, [dispatch, reefId, hasSpotter, range, pickerDate]);

  // update the end date once spotter data changes. Happens when `range` is changed.
  useEffect(() => {
    if (dailyData && spotterData) {
      const maxDataDate = new Date(findMaxDate(dailyData, spotterData));
      if (maxDataDate.getTime() > new Date(pickerDate).getTime()) {
        setEndDate(pickerDate);
      } else {
        setEndDate(maxDataDate.toISOString());
      }
    }
  }, [dailyData, spotterData, pickerDate]);

  const onRangeChange = useCallback(
    (event: ChangeEvent<{ value: unknown }>) => {
      setRange(event.target.value as Range);
    },
    []
  );

  const onDateChange = useCallback(
    (date: MaterialUiPickersDate, value?: string | null) => {
      if (value) {
        setPickerDate(new Date(value).toISOString());
      }
    },
    []
  );

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
      <ReefNavBar searchLocation={false} />
      <Container className={!hasDailyData ? classes.noDataWrapper : ""}>
        {reefDetails && liveData && !error ? (
          <>
            <ReefInfo
              hasDailyData={hasDailyData}
              reef={reefDetails}
              lastSurvey={surveyList[surveyList.length - 1]?.diveDate}
              isManager={isAdmin(user, parseInt(reefId, 10))}
            />
            {!hasSpotter && (
              <Box mt="1.3rem">
                <Alert severity="info">
                  {getAlertMessage(user, reefId, hasDailyData)}
                </Alert>
              </Box>
            )}
            <ReefDetails
              reef={{
                ...reefDetails,
                featuredImage: imageUrl,
              }}
              startDate={subtractFromDate(endDate || pickerDate, range)}
              endDate={endDate || pickerDate}
              pickerDate={pickerDate}
              range={range}
              onRangeChange={onRangeChange}
              onDateChange={onDateChange}
              hasSpotter={hasSpotter}
              chartPeriod={findChartPeriod(range)}
              hasDailyData={hasDailyData}
              spotterData={spotterData}
              surveys={surveyList}
              point={poiId}
              diveDate={diveDate}
            />
          </>
        ) : (
          <Container className={classes.noData}>
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="center"
            >
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
