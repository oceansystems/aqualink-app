import React from "react";
import { Map, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { withStyles, WithStyles, createStyles } from "@material-ui/core";

import marker from "../assets/marker.png";

const myIcon = L.icon({
  iconUrl: marker,
  iconSize: [20, 30],
  iconAnchor: [10, 30],
  popupAnchor: [0, -41],
});

const ReefMap = ({ center, classes }: ReefMapProps) => {
  return (
    <Map className={classes.map} center={center} zoom={8}>
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      <Marker icon={myIcon} position={center} />
    </Map>
  );
};

const styles = () => {
  return createStyles({
    map: {
      height: "100%",
      width: "100%",
      borderRadius: 4,
    },
  });
};

interface ReefMapIncomingProps {
  center: [number, number];
}

type ReefMapProps = WithStyles<typeof styles> & ReefMapIncomingProps;

export default withStyles(styles)(ReefMap);
