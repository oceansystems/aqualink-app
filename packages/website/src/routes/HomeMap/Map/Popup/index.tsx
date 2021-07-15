import React, { useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  createStyles,
  Grid,
  Theme,
  Tooltip,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { Popup as LeafletPopup, useLeaflet } from "react-leaflet";
import { useSelector } from "react-redux";

import type { LatLngTuple } from "leaflet";
import type { Reef } from "../../../../store/Reefs/types";
import { getReefNameAndRegion } from "../../../../store/Reefs/helpers";
import { colors } from "../../../../layout/App/theme";
import { formatNumber } from "../../../../helpers/numberUtils";
import { dhwColorFinder } from "../../../../helpers/degreeHeatingWeeks";
import { reefOnMapSelector } from "../../../../store/Homepage/homepageSlice";

const Popup = ({ reef, classes, autoOpen }: PopupProps) => {
  const { map } = useLeaflet();
  const reefOnMap = useSelector(reefOnMapSelector);
  const popupRef = useRef<LeafletPopup>(null);
  const { name, region } = getReefNameAndRegion(reef);
  const isNameLong = name && name.length > 50;

  const { dhw, satelliteTemperature } = reef.collectionData || {};

  useEffect(() => {
    if (
      map &&
      popupRef?.current &&
      reefOnMap?.id === reef.id &&
      reefOnMap?.polygon.type === "Point" &&
      autoOpen
    ) {
      const { leafletElement: popup } = popupRef.current;
      const [lng, lat] = reefOnMap.polygon.coordinates;

      const point: LatLngTuple = [lat, lng];
      popup.setLatLng(point).openOn(map);
    }
  }, [autoOpen, map, reef.id, reefOnMap]);

  return (
    <LeafletPopup
      ref={reefOnMap?.id === reef.id ? popupRef : null}
      closeButton={false}
      className={classes.popup}
      autoPan={false}
    >
      <Card>
        <CardHeader
          className={classes.popupHeader}
          classes={{
            content: classes.popupHeaderContent,
            subheader: classes.subheader,
          }}
          title={
            <span title={isNameLong && name ? name : undefined}>
              {isNameLong ? `${name?.substring(0, 50)}...` : name}
            </span>
          }
          subheader={region}
        />
        <CardContent>
          <Grid container item xs={12}>
            <Grid item xs={6}>
              <Grid container item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  SST
                </Typography>
              </Grid>
              <Grid container item xs={12}>
                <Typography
                  style={{ color: colors.lightBlue }}
                  variant="h5"
                  color="textSecondary"
                >
                  {`${formatNumber(satelliteTemperature, 1)}  °C`}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  HEAT STRESS
                </Typography>
              </Grid>
              <Grid container alignItems="flex-end" item xs={12}>
                <Typography
                  style={{
                    color: `${dhwColorFinder(dhw)}`,
                  }}
                  variant="h5"
                  color="textSecondary"
                >
                  {formatNumber(dhw, 1)}
                  &nbsp;
                </Typography>
                <Tooltip title="Degree Heating Weeks - a measure of the amount of time above the 20 year historical maximum temperatures">
                  <Typography
                    style={{
                      color: `${dhwColorFinder(dhw)}`,
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
          <Grid style={{ margin: "1rem 0 1rem 0" }} container item xs={12}>
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

    popupHeaderContent: {
      width: "100%",
      overflowWrap: "break-word",
    },

    subheader: {
      color: "white",
    },

    popup: {
      width: 215,
    },
  });

interface PopupIncomingProps {
  reef: Reef;
  // Dictates whether the popup automatically opens when the reef is selected (reef on map is set)
  autoOpen?: boolean;
}

Popup.defaultProps = {
  autoOpen: true,
};

type PopupProps = PopupIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(Popup);
