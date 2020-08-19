import React from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme,
  Card,
  CardContent,
  Typography,
  CardHeader,
  Grid,
} from "@material-ui/core";

import type { Data } from "../../../../store/Reefs/types";
import { sortDailyData } from "../../../../helpers/sortDailyData";
import { formatNumber } from "../../../../helpers/numberUtils";
import wind from "../../../../assets/wind.svg";
import clouds from "../../../../assets/clouds.svg";
import clouds2 from "../../../../assets/clouds2.svg";
import arrow from "../../../../assets/directioncircle.svg";

const Wind = ({ dailyData, classes }: WindProps) => {
  const sortByDate = sortDailyData(dailyData, "desc");
  const { maxWindSpeed, windDirection } = sortByDate[0];

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title={
          <Grid container justify="flex-start">
            <Grid item xs={2}>
              <img alt="wind" src={wind} />
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.cardTitle} variant="h6">
                WIND
              </Typography>
            </Grid>
          </Grid>
        }
      />
      <CardContent className={classes.contentWrapper}>
        <Grid
          style={{ height: "100%" }}
          container
          justify="center"
          item
          xs={12}
        >
          <Grid container justify="flex-end" item xs={9}>
            <img style={{ height: "5rem" }} alt="clouds" src={clouds} />
          </Grid>
          <Grid container justify="center" item xs={10}>
            <Grid item xs={6}>
              <Typography
                className={classes.contentTitles}
                color="textSecondary"
                variant="subtitle2"
              >
                SPEED
              </Typography>
              <Grid container alignItems="baseline">
                <Typography
                  className={classes.contentValues}
                  color="textSecondary"
                >
                  {formatNumber(maxWindSpeed, 1) || "- -"}
                </Typography>
                {maxWindSpeed && (
                  <Typography
                    className={classes.contentUnits}
                    color="textSecondary"
                    variant="h6"
                  >
                    KM/H
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Typography
                className={classes.contentTitles}
                color="textSecondary"
                variant="subtitle2"
              >
                DIRECTION
              </Typography>
              <Grid container alignItems="baseline">
                {windDirection && (
                  <img
                    style={{ transform: `rotate(${windDirection}deg)` }}
                    className={classes.arrow}
                    alt="arrow"
                    src={arrow}
                  />
                )}
                <Typography
                  className={classes.contentValues}
                  color="textSecondary"
                  variant="h3"
                >
                  {windDirection ? `${windDirection}\u00B0` : "- -"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            style={{ height: "5rem" }}
            container
            justify="flex-start"
            item
            xs={7}
          >
            <img style={{ height: "100%" }} alt="clouds" src={clouds2} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    card: {
      height: "100%",
      width: "100%",
      backgroundColor: "#eff0f0",
      display: "flex",
      flexDirection: "column",
    },
    cardTitle: {
      lineHeight: 1.5,
      margin: "0 0 0.5rem 1rem",
      color: theme.palette.primary.main,
    },
    header: {
      flex: "0 1 auto",
      paddingLeft: "2rem",
      paddingBottom: 0,
    },
    contentWrapper: {
      flex: "1 1 auto",
      padding: 0,
    },
    content: {
      padding: "0 0 2rem 2rem",
    },
    contentTitles: {
      lineHeight: 1.33,
    },
    contentValues: {
      fontSize: 42,
      [theme.breakpoints.between("md", "lg")]: {
        fontSize: 32,
      },
      marginRight: "0.25rem",
      fontWeight: 300,
    },
    contentUnits: {
      [theme.breakpoints.between("md", "lg")]: {
        fontSize: 12,
      },
    },
    arrow: {
      width: 20,
      height: 20,
      [theme.breakpoints.between("md", "lg")]: {
        width: 14,
        height: 14,
      },
    },
  });

interface WindIncomingProps {
  dailyData: Data[];
}

type WindProps = WithStyles<typeof styles> & WindIncomingProps;

export default withStyles(styles)(Wind);
