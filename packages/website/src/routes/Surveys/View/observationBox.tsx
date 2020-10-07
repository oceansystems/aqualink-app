import React from "react";

import {
  createStyles,
  Grid,
  withStyles,
  WithStyles,
  Typography,
} from "@material-ui/core";
import { DailyData } from "../../../store/Reefs/types";
import { getDailyDataClosestToDate } from "../../../helpers/sortDailyData";
import { formatNumber } from "../../../helpers/numberUtils";

const ObservationBox = ({
  depth,
  dailyData,
  date,
  classes,
}: ObservationBoxProps) => {
  const data = getDailyDataClosestToDate(dailyData, date);
  const {
    avgBottomTemperature,
    surfaceTemperature,
    satelliteTemperature,
  } = data;

  return (
    <div className={classes.outerDiv}>
      <Grid container direction="column">
        <Grid container item direction="column" spacing={4}>
          <Grid container item direction="column" spacing={1}>
            <Grid item>
              <Typography color="textPrimary" variant="subtitle1">
                SATELLITE OBSERVATION
              </Typography>
            </Grid>
            <Grid container item direction="column">
              <Typography color="textPrimary" variant="overline">
                SURFACE TEMP
              </Typography>
              <Typography color="textPrimary" variant="h4">
                {`${formatNumber(satelliteTemperature, 1)} °C`}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item direction="column" spacing={1}>
            <Grid item>
              <Typography color="textPrimary" variant="subtitle1">
                SENSOR OBSERVATION
              </Typography>
            </Grid>
            <Grid container item spacing={2}>
              <Grid container item direction="column" xs={6}>
                <Typography color="textPrimary" variant="overline">
                  TEMP AT 1m
                </Typography>
                <Typography color="textPrimary" variant="h4">
                  {`${formatNumber(surfaceTemperature, 1)} °C`}
                </Typography>
              </Grid>
              <Grid container item direction="column" xs={6}>
                <Typography color="textPrimary" variant="overline">
                  {`TEMP AT ${depth}m`}
                </Typography>
                <Typography color="textPrimary" variant="h4">
                  {`${formatNumber(avgBottomTemperature, 1)} °C`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

const styles = () =>
  createStyles({
    outerDiv: {
      backgroundColor: "#128cc0",
      borderRadius: "0.4rem",
      display: "flex",
      padding: "1rem",
      flexGrow: 1,
    },
  });

interface ObservationBoxIncomingProps {
  depth: number | null;
  dailyData: DailyData[];
  date: Date;
}

type ObservationBoxProps = ObservationBoxIncomingProps &
  WithStyles<typeof styles>;

export default withStyles(styles)(ObservationBox);
