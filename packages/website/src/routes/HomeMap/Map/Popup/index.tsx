import React from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Button,
  Tooltip,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { Popup as LeafletPopup } from "react-leaflet";

import { Reef } from "../../../../store/Reefs/types";
import { getReefNameAndRegion } from "../../../../store/Reefs/helpers";
import { colors } from "../../../../layout/App/theme";
import { formatNumber } from "../../../../helpers/numberUtils";
import {
  dhwColorFinder,
  degreeHeatingWeeksCalculator,
} from "../../../../helpers/degreeHeatingWeeks";

const Popup = ({ reef, classes }: PopupProps) => {
  const { degreeHeatingDays, maxBottomTemperature, satelliteTemperature } =
    reef.latestDailyData || {};

  return (
    <LeafletPopup closeButton={false} className={classes.popup}>
      <Card>
        <CardHeader
          className={classes.popupHeader}
          classes={{
            subheader: classes.subheader,
          }}
          title={getReefNameAndRegion(reef).name}
          subheader={getReefNameAndRegion(reef).region}
        />
        <CardContent>
          <Grid container item xs={12}>
            {maxBottomTemperature ? (
              <Grid item xs={6}>
                <Grid container justify="flex-start" item xs={12}>
                  <Typography variant="caption" color="textSecondary">
                    {`TEMP AT ${reef.depth}m`}
                  </Typography>
                </Grid>
                <Grid container justify="flex-start" item xs={12}>
                  <Typography
                    style={{ color: colors.lightBlue }}
                    variant="h5"
                    color="textSecondary"
                  >
                    {`${formatNumber(maxBottomTemperature, 1)}  °C`}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Grid item xs={6}>
                <Grid container justify="flex-start" item xs={12}>
                  <Typography variant="caption" color="textSecondary">
                    SAT. TEMP.
                  </Typography>
                </Grid>
                <Grid container justify="flex-start" item xs={12}>
                  <Typography
                    style={{ color: colors.lightBlue }}
                    variant="h5"
                    color="textSecondary"
                  >
                    {`${formatNumber(satelliteTemperature, 1)}  °C`}
                  </Typography>
                </Grid>
              </Grid>
            )}
            <Grid item xs={6}>
              <Grid container justify="flex-start" item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  HEAT STRESS
                </Typography>
              </Grid>
              <Grid container alignItems="flex-end" item xs={12}>
                <Typography
                  style={{
                    color: `${dhwColorFinder(
                      degreeHeatingWeeksCalculator(degreeHeatingDays)
                    )}`,
                  }}
                  variant="h5"
                  color="textSecondary"
                >
                  {formatNumber(
                    degreeHeatingWeeksCalculator(degreeHeatingDays),
                    1
                  )}
                  &nbsp;
                </Typography>
                <Tooltip title="Degree Heating Weeks - a measure of the amount of time above the 20 year historical maximum temperatures">
                  <Typography
                    style={{
                      color: `${dhwColorFinder(
                        degreeHeatingWeeksCalculator(degreeHeatingDays)
                      )}`,
                      position: "relative",
                      bottom: 0,
                    }}
                    variant="h6"
                    color="textSecondary"
                  >
                    DHW
                  </Typography>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            style={{ margin: "1rem 0 1rem 0" }}
            container
            justify="flex-start"
            item
            xs={12}
          >
            <Grid item>
              <Link
                style={{ color: "inherit", textDecoration: "none" }}
                to={`/reefs/${reef.id}`}
              >
                <Button size="small" variant="outlined" color="primary">
                  EXPLORE
                </Button>
              </Link>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </LeafletPopup>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    popupHeader: {
      backgroundColor: theme.palette.primary.main,
    },

    subheader: {
      color: "white",
    },

    popup: {
      width: "12vw",
      minWidth: 200,
    },
  });

interface PopupIncomingProps {
  reef: Reef;
}

type PopupProps = PopupIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(Popup);
