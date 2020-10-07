import React from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Card,
  CardContent,
  Typography,
  CardHeader,
  Grid,
  Tooltip,
  Box,
} from "@material-ui/core";

import { dhwColorCode } from "../../../../assets/colorCode";
import type { LiveData } from "../../../../store/Reefs/types";
import { formatNumber } from "../../../../helpers/numberUtils";
import satellite from "../../../../assets/satellite.svg";
import {
  dhwColorFinder,
  degreeHeatingWeeksCalculator,
} from "../../../../helpers/degreeHeatingWeeks";
import { styles as incomingStyles } from "../styles";

const Satellite = ({ maxMonthlyMean, liveData, classes }: SatelliteProps) => {
  const { degreeHeatingDays, satelliteTemperature } = liveData;

  const degreeHeatingWeeks = degreeHeatingWeeksCalculator(
    degreeHeatingDays?.value
  );

  const metrics = [
    {
      label: "SURFACE TEMP",
      value: `${formatNumber(satelliteTemperature?.value, 1)} °C`,
    },
    {
      label: "HISTORICAL MAX",
      value: `${formatNumber(maxMonthlyMean, 1)} °C`,
      tooltipTitle: "Historical maximum monthly average over the past 20 years",
    },
    {
      label: "HEAT STRESS",
      large: true,
      value: `${formatNumber(degreeHeatingWeeks, 1)} DHW`,
      tooltipTitle:
        "Degree Heating Weeks - a measure of the amount of time above the 20 year historical maximum temperatures",
    },
  ];

  return (
    <Card
      className={classes.card}
      style={{ backgroundColor: dhwColorFinder(degreeHeatingWeeks) }}
    >
      <CardHeader
        className={classes.header}
        title={
          <Grid container justify="space-between">
            <Grid container item xs={8}>
              <Typography className={classes.cardTitle} variant="h6">
                SATELLITE OBSERVATION
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <img
                className={classes.titleImage}
                alt="satellite"
                src={satellite}
              />
            </Grid>
          </Grid>
        }
      />

      <CardContent className={classes.content}>
        <Box p="1rem" display="flex" flexGrow={1}>
          <Grid container spacing={3}>
            {metrics.map(({ label, large, value, tooltipTitle }) => (
              <Grid key={label} item xs={large ? 12 : 6}>
                <Typography
                  className={classes.contentTextTitles}
                  variant="subtitle2"
                >
                  {label}
                </Typography>
                {tooltipTitle ? (
                  <Tooltip title={tooltipTitle}>
                    <Typography
                      className={classes.contentTextValues}
                      variant="h2"
                    >
                      {value}
                    </Typography>
                  </Tooltip>
                ) : (
                  <Typography
                    className={classes.contentTextValues}
                    variant="h2"
                  >
                    {value}
                  </Typography>
                )}
              </Grid>
            ))}
          </Grid>
        </Box>

        <Grid container>
          {dhwColorCode.map(({ value, color }) => (
            <Grid
              key={value}
              item
              xs={1}
              style={{ backgroundColor: `${color}`, height: "2rem" }}
            >
              <Box textAlign="center">
                <Typography variant="caption" align="center">
                  {value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

const styles = () =>
  createStyles({
    ...incomingStyles,
    card: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    titleImage: {
      height: 35,
      width: 35,
    },
    content: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      flexGrow: 1,
      padding: 0,
    },
    contentText: {
      marginTop: "1rem",
      padding: "0 1rem",
    },
  });

interface SatelliteIncomingProps {
  maxMonthlyMean: number | null;
  liveData: LiveData;
}

type SatelliteProps = WithStyles<typeof styles> & SatelliteIncomingProps;

export default withStyles(styles)(Satellite);
