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

import { colorCode } from "../../../../assets/colorCode";
import type { Data } from "../../../../store/Reefs/types";
import { sortDailyData } from "../../../../helpers/sortDailyData";
import { formatNumber } from "../../../../helpers/numberUtils";
import satellite from "../../../../assets/satellite.svg";
import { degreeHeatingWeeksCalculator } from "../../../../helpers/degreeHeatingWeeks";

const Satellite = ({ dailyData, classes }: SatelliteProps) => {
  const sortByDate = sortDailyData(dailyData, "desc");
  const { degreeHeatingDays, satelliteTemperature } = sortByDate[0];

  const degreeHeatingWeeks = degreeHeatingWeeksCalculator(degreeHeatingDays);

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title={
          <Grid container alignItems="center" justify="space-between">
            <Grid item xs={8}>
              <Typography className={classes.cardTitle} variant="h6">
                SATELLITE OBSERVATION
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <img alt="satellite" src={satellite} />
            </Grid>
          </Grid>
        }
      />
      <CardContent className={classes.content}>
        <Grid
          container
          direction="column"
          alignItems="stretch"
          justify="space-between"
          style={{ height: "100%" }}
        >
          <Grid className={classes.contentText} item>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  className={classes.contentTextTitles}
                  color="textPrimary"
                  variant="subtitle2"
                >
                  SURFACE TEMP
                </Typography>
                <Typography
                  className={classes.contentTextValues}
                  color="textPrimary"
                  variant="h2"
                >
                  {satelliteTemperature
                    ? `${formatNumber(satelliteTemperature, 1)} \u2103`
                    : "- -"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  className={classes.contentTextTitles}
                  color="textPrimary"
                  variant="subtitle2"
                >
                  DEGREE HEATING WEEKS
                </Typography>
                <Typography
                  className={classes.contentTextValues}
                  color="textPrimary"
                  variant="h2"
                >
                  {formatNumber(degreeHeatingWeeks, 1) || "- -"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item container>
            {colorCode.map((elem) => (
              <Grid
                container
                justify="center"
                alignItems="center"
                key={elem.value}
                item
                xs={1}
              >
                <Grid
                  container
                  justify="center"
                  alignItems="center"
                  item
                  style={{ backgroundColor: `${elem.color}`, height: "2rem" }}
                >
                  <Typography variant="caption">{elem.value}</Typography>
                </Grid>
              </Grid>
            ))}
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
      backgroundColor: "#0c9da5",
      display: "flex",
      flexDirection: "column",
    },
    cardTitle: {
      lineHeight: 1.5,
      margin: "0 0 0.5rem 1rem",
    },
    header: {
      flex: "0 1 auto",
      padding: "0.5rem 1.5rem 0 1rem",
    },
    content: {
      flex: "1 1 auto",
      padding: 0,
    },
    contentText: {
      padding: "2rem 3rem 0 3rem",
    },
    contentTextTitles: {
      lineHeight: 1.33,
    },
    contentTextValues: {
      fontWeight: 300,
      [theme.breakpoints.between("md", "lg")]: {
        fontSize: 32,
      },
    },
  });

interface SatelliteIncomingProps {
  dailyData: Data[];
}

type SatelliteProps = WithStyles<typeof styles> & SatelliteIncomingProps;

export default withStyles(styles)(Satellite);
