import React from "react";
import {
  createStyles,
  Grid,
  withStyles,
  WithStyles,
  Theme,
  Typography,
} from "@material-ui/core";

import Map from "./Map";
import FeatureVideo from "./FeatureVideo";
import Satellite from "./Satellite";
import Sensor from "./Sensor";
import Wind from "./Wind";
import Waves from "./Waves";
import Charts from "./Charts";
import type { Reef } from "../../../store/Reefs/types";
import { locationCalculator } from "../../../helpers/locationCalculator";

const ReefDetails = ({ classes, reef }: ReefDetailProps) => {
  const [lng, lat] = locationCalculator(reef.polygon);

  return (
    <Grid container justify="center" className={classes.root}>
      <Grid container item xs={11} alignItems="baseline">
        <Typography
          style={{ marginLeft: "2rem" }}
          className={classes.cardTitles}
          variant="h6"
        >
          LOCATION:
        </Typography>
        <Typography className={classes.cardTitles} variant="subtitle2">
          LAT: {lat}
        </Typography>
        <Typography className={classes.cardTitles} variant="subtitle2">
          LONG: {lng}
        </Typography>
      </Grid>
      <Grid container justify="space-between" item xs={11} spacing={4}>
        <Grid item xs={12} md={reef.videoStream ? 6 : 9}>
          <div className={classes.container}>
            <Map polygon={reef.polygon} />
          </div>
        </Grid>
        <Grid item xs={12} md={reef.videoStream ? 6 : 3}>
          <div className={classes.container}>
            <FeatureVideo url={reef.videoStream} />
          </div>
        </Grid>
      </Grid>
      <Grid container justify="space-between" item xs={11} spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <div className={classes.smallContainer}>
            <Satellite dailyData={reef.dailyData} />
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <div className={classes.smallContainer}>
            <Sensor reef={reef} />
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <div className={classes.smallContainer}>
            <Wind dailyData={reef.dailyData} />
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <div className={classes.smallContainer}>
            <Waves dailyData={reef.dailyData} />
          </div>
        </Grid>
      </Grid>
      <Grid container justify="center" item xs={12}>
        <Charts
          dailyData={reef.dailyData}
          depth={reef.depth}
          // TODO - Remove default
          temperatureThreshold={(reef.maxMonthlyMean || 20) + 1}
        />
      </Grid>
    </Grid>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: "2rem",
    },
    cardTitles: {
      lineHeight: 1.5,
      color: "#2f2f2f",
      margin: "0 0 0.5rem 1rem",
    },
    container: {
      height: "55vh",
      marginBottom: "3rem",
      [theme.breakpoints.between("md", "lg")]: {
        height: "50vh",
      },
    },
    smallContainer: {
      height: "35vh",
      marginBottom: "5rem",
      [theme.breakpoints.down("xs")]: {
        height: "48vh",
      },
    },
  });

type ReefDetailProps = WithStyles<typeof styles> & { reef: Reef };

export default withStyles(styles)(ReefDetails);
