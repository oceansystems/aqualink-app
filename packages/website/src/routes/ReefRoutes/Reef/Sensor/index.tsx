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
  Chip,
  Box,
} from "@material-ui/core";

import { formatNumber } from "../../../../helpers/numberUtils";
import type { Reef } from "../../../../store/Reefs/types";
import sensor from "../../../../assets/sensor.svg";
import buoy from "../../../../assets/buoy.svg";
import { styles as incomingStyles } from "../styles";

const Sensor = ({ reef, classes }: SensorProps) => {
  const { surfaceTemperature, bottomTemperature } = reef.liveData;

  const hasSpotter = Boolean(
    surfaceTemperature?.value || bottomTemperature?.value
  );

  const metrics = [
    {
      label: "TEMP AT 1m",
      value: `${formatNumber(surfaceTemperature?.value, 1)} °C`,
    },
    {
      label: `TEMP AT ${reef.depth}m`,
      value: `${formatNumber(bottomTemperature?.value, 1)} °C`,
    },
  ];

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        title={
          <Grid container justify="space-between">
            <Grid item xs={8}>
              <Typography className={classes.cardTitle} variant="h6">
                SENSOR OBSERVATION
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <img className={classes.titleImage} alt="buoy" src={buoy} />
            </Grid>
          </Grid>
        }
      />

      <CardContent className={classes.content}>
        <Box
          p="1rem"
          display="flex"
          flexGrow={1}
          style={{ position: "relative" }}
        >
          <Grid container direction="row" spacing={3}>
            {metrics.map(({ label, value }) => (
              <Grid key={label} item xs={12}>
                <Typography
                  className={classes.contentTextTitles}
                  variant="subtitle2"
                >
                  {label}
                </Typography>
                <Typography className={classes.contentTextValues} variant="h2">
                  {value}
                </Typography>
              </Grid>
            ))}
            {!hasSpotter && (
              <Grid item xs={12}>
                <Chip
                  className={classes.noSensorAlert}
                  label="Not Installed Yet"
                />
              </Grid>
            )}
          </Grid>

          <Box position="absolute" bottom={0} right={0}>
            <img alt="sensor" src={sensor} />
          </Box>
        </Box>
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
      backgroundColor: "#128cc0",
      paddingBottom: "1rem",
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
    noSensorAlert: {
      backgroundColor: "#edb86f",
      borderRadius: 4,
      color: "white",
    },
  });

interface SensorIncomingProps {
  reef: Reef;
}

type SensorProps = WithStyles<typeof styles> & SensorIncomingProps;

export default withStyles(styles)(Sensor);
