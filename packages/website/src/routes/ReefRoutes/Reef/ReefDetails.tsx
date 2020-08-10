import React from "react";
import {
  createStyles,
  Grid,
  withStyles,
  WithStyles,
  Theme,
} from "@material-ui/core";

import Map from "./Map";
import FeatureVideo from "./FeatureVideo";
import Temperature from "./Temperature";
import Stats from "./Stats";
import Charts from "./Charts";
import type { Reef } from "../../../store/Reefs/types";

const ReefDetails = ({ classes, reef }: ReefDetailProps) => (
  <Grid container justify="center" className={classes.root}>
    <Grid container justify="space-evenly" item xs={10}>
      <Grid key={1} item xs={11} md={5}>
        <div className={classes.container}>
          <Map polygon={reef.polygon} />
        </div>
      </Grid>
      <Grid key={2} item xs={11} md={5}>
        <div className={classes.container}>
          <FeatureVideo url={reef.videoStream || ""} />
        </div>
      </Grid>
    </Grid>
    <Grid container justify="space-evenly" item xs={10}>
      <Grid key={3} item xs={11} md={5}>
        <div className={classes.smallContainer}>
          <Temperature dailyData={reef.dailyData} />
        </div>
      </Grid>
      <Grid key={4} item xs={11} md={5}>
        <div className={`${classes.smallContainer} ${classes.statsContainer}`}>
          <Stats dailyData={reef.dailyData} />
        </div>
      </Grid>
    </Grid>
    <Grid container justify="center" item xs={12}>
      <Charts
        dailyData={reef.dailyData}
        temperatureThreshold={reef.temperatureThreshold}
      />
    </Grid>
  </Grid>
);

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: "5rem",
    },
    container: {
      height: "48vh",
      marginBottom: "5rem",
      [theme.breakpoints.between("md", "lg")]: {
        height: "35vh",
      },
    },
    smallContainer: {
      height: "30vh",
      marginBottom: "5rem",
    },
    statsContainer: {
      [theme.breakpoints.down("sm")]: {
        height: "35vh",
      },
      [theme.breakpoints.down("xs")]: {
        height: "28vh",
      },
    },
  });

type ReefDetailProps = WithStyles<typeof styles> & { reef: Reef };

export default withStyles(styles)(ReefDetails);
