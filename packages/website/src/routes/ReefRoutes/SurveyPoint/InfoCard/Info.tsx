import React from "react";
import {
  Box,
  Grid,
  Typography,
  withStyles,
  WithStyles,
  createStyles,
  Button,
} from "@material-ui/core";
import { useSelector } from "react-redux";

import { Reef } from "../../../../store/Reefs/types";
import { surveyListSelector } from "../../../../store/Survey/surveyListSlice";
import { getReefNameAndRegion } from "../../../../store/Reefs/helpers";
import { filterSurveys } from "../../../../helpers/surveys";
import { displayTimeInLocalTimezone } from "../../../../helpers/dates";
import { reefTimeSeriesDataSelector } from "../../../../store/Reefs/selectedReefSlice";
import { formatNumber } from "../../../../helpers/numberUtils";
import { isAdmin } from "../../../../helpers/user";
import { userInfoSelector } from "../../../../store/User/userSlice";
import SurveyInfo from "./SurveyInfo";

const Info = ({ reef, pointId, onEditButtonClick, classes }: InfoProps) => {
  const surveys = filterSurveys(
    useSelector(surveyListSelector),
    "any",
    pointId
  );
  const user = useSelector(userInfoSelector);
  const { bottomTemperature: hoboBottomTemperature } =
    useSelector(reefTimeSeriesDataSelector)?.hobo || {};
  const { name: pointName, polygon: pointPolygon } =
    reef.surveyPoints.filter((point) => point.id === pointId)[0] || {};
  const { name: reefName, region: reefRegion } = getReefNameAndRegion(reef);
  const [lng, lat] =
    pointPolygon?.type === "Point" ? pointPolygon.coordinates : [];
  const nHoboPoints = hoboBottomTemperature?.length || 0;
  const lastSurveyed = displayTimeInLocalTimezone({
    isoDate: surveys[0]?.diveDate,
    displayTimezone: false,
    timeZone: reef.timezone,
    format: "MMM DD[,] YYYY",
  });

  return (
    <Grid className={classes.cardInfo} item xs={11} md={6}>
      <Grid container>
        <Box mb="24px">
          <Typography variant="subtitle2" color="textSecondary">
            Last surveyed: {lastSurveyed}
          </Typography>
        </Box>
      </Grid>
      <Grid
        className={classes.autoWidth}
        container
        justify="space-between"
        spacing={2}
      >
        <Grid className={classes.infoWrapper} item>
          <Grid
            className={classes.autoWidth}
            container
            direction="column"
            spacing={2}
          >
            <Grid className={classes.nameWrapper} item>
              <Typography variant="h5" color="textSecondary">
                {pointName}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {reefName}
                {reefRegion && `, ${reefRegion}`}
              </Typography>
            </Grid>
            {lat && lng && (
              <Grid item>
                <Grid className={classes.autoWidth} container spacing={1}>
                  <Grid item>
                    <Typography variant="subtitle2" color="textSecondary">
                      LAT: {formatNumber(lat, 6)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2" color="textSecondary">
                      LNG: {formatNumber(lng, 6)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )}
            {nHoboPoints > 0 && (
              <Grid item>
                <Typography variant="subtitle2" color="textSecondary">
                  {nHoboPoints} HOBO DATA POINTS
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
        <SurveyInfo pointId={pointId} surveys={surveys} />
      </Grid>
      {isAdmin(user, reef.id) && (
        <Grid container>
          <Box mt="24px">
            <Button
              color="primary"
              variant="outlined"
              size="small"
              onClick={onEditButtonClick}
            >
              Edit Point Details
            </Button>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

const styles = () =>
  createStyles({
    cardInfo: {
      padding: 24,
    },

    infoWrapper: {
      maxWidth: "100%",
    },

    nameWrapper: {
      maxWidth: "100%",
      overflowWrap: "break-word",
    },

    coordinates: {
      marginTop: 16,
    },

    autoWidth: {
      width: "auto",
    },
  });

interface InfoIncomingProps {
  reef: Reef;
  pointId: number;
  onEditButtonClick: () => void;
}

type InfoProps = InfoIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(Info);
