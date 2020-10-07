import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Map, TileLayer } from "react-leaflet";
import { LatLng } from "leaflet";
import {
  createStyles,
  withStyles,
  WithStyles,
  CircularProgress,
} from "@material-ui/core";

import { reefsListLoadingSelector } from "../../../store/Reefs/reefsListSlice";
import { ReefMarkers } from "./Markers";
import { SofarLayers } from "./sofarLayers";
import Legend from "./Legend";
import AlertLevelLegend from "./alertLevelLegend";

const INITIAL_CENTER = new LatLng(37.9, -75.3);
const INITIAL_ZOOM = 5;
const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const tileURL = accessToken
  ? `https://api.mapbox.com/styles/v1/eric-ovio/ckesyzu658klw19s6zc0adlgp/tiles/{z}/{x}/{y}@2x?access_token=${accessToken}`
  : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}@2x";

const attribution = accessToken
  ? '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
  : "";

const HomepageMap = ({ classes }: HomepageMapProps) => {
  const [legendName, setLegendName] = useState<string>("");
  const loading = useSelector(reefsListLoadingSelector);
  const ref = useRef<Map>(null);

  useEffect(() => {
    const { current } = ref;
    if (current && current.leafletElement) {
      const map = current.leafletElement;
      map.on("baselayerchange", (layer: any) => {
        setLegendName(layer.name);
      });
    }
  });

  return loading ? (
    <div className={classes.loading}>
      <CircularProgress size="10rem" thickness={1} />
    </div>
  ) : (
    <Map
      ref={ref}
      preferCanvas
      maxBoundsViscosity={1.0}
      className={classes.map}
      center={INITIAL_CENTER}
      zoom={INITIAL_ZOOM}
      minZoom={2}
      worldCopyJump
    >
      <TileLayer attribution={attribution} url={tileURL} />
      <SofarLayers />
      <ReefMarkers />
      <Legend legendName={legendName} />
      <AlertLevelLegend />
      <div className="mapbox-wordmark" />
    </Map>
  );
};

const styles = () =>
  createStyles({
    map: {
      flex: 1,
    },
    loading: {
      height: "100%",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });

type HomepageMapProps = WithStyles<typeof styles>;

export default withStyles(styles)(HomepageMap);
