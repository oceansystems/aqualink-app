import React from "react";
import { Map, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { withStyles, WithStyles, createStyles, Theme } from "@material-ui/core";

import marker from "../../../assets/marker.png";

const pinIcon = L.icon({
  iconUrl: marker,
  iconSize: [20, 30],
  iconAnchor: [10, 30],
  popupAnchor: [0, -41],
});

const LocationMap = ({
  markerPositionLat,
  markerPositionLng,
  updateMarkerPosition,
  classes,
}: LocationMapProps) => {
  function updateLatLng(event: L.LeafletMouseEvent) {
    const { lat, lng } = event.latlng;
    updateMarkerPosition([lat, lng]);
  }

  function parseCoordinates(coord: string, defaultValue: number) {
    const parsed = parseFloat(coord);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }

  const markerPosition: L.LatLngTuple = [
    parseCoordinates(markerPositionLat, 37.773972),
    parseCoordinates(markerPositionLng, -122.431297),
  ];

  return (
    <Map
      center={markerPosition}
      zoom={5}
      className={classes.map}
      onclick={updateLatLng}
    >
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      {markerPosition && <Marker icon={pinIcon} position={markerPosition} />}
    </Map>
  );
};

const styles = (theme: Theme) => {
  return createStyles({
    map: {
      height: "100%",
      width: "100%",
      borderRadius: 4,
      cursor: "pointer",

      [theme.breakpoints.down("md")]: {
        height: 400,
      },
    },
  });
};

export interface LocationMapProps extends WithStyles<typeof styles> {
  markerPositionLat: string;
  markerPositionLng: string;
  updateMarkerPosition(tuple: L.LatLngTuple): void;
}

export default withStyles(styles)(LocationMap);
