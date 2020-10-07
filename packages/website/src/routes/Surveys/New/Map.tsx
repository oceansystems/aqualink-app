import React, { useRef, useEffect, useState } from "react";
import { Map, TileLayer, Marker } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import L from "leaflet";
import { withStyles, WithStyles, createStyles } from "@material-ui/core";

import { Reef } from "../../../store/Reefs/types";
import { mapBounds } from "../../../helpers/mapBounds";

import marker from "../../../assets/marker.png";
import {
  setDiveLocation,
  diveLocationSelector,
} from "../../../store/Survey/surveySlice";

const pinIcon = L.icon({
  iconUrl: marker,
  iconSize: [20, 30],
  iconAnchor: [10, 30],
  popupAnchor: [0, -41],
});

const ReefMap = ({ polygon, classes }: ReefMapProps) => {
  const mapRef = useRef<Map>(null);
  const diveLocation = useSelector(diveLocationSelector);
  const [markerLat, setMarkerLat] = useState<number | null>(null);
  const [markerLng, setMarkerLng] = useState<number | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const { current } = mapRef;
    if (current && current.leafletElement) {
      const map = current.leafletElement;
      // Initialize map's position to fit the given polygon
      if (polygon.type === "Polygon") {
        map.fitBounds(mapBounds(polygon));
      } else {
        map.panTo(new L.LatLng(polygon.coordinates[1], polygon.coordinates[0]));
      }
      const zoom = map.getZoom();
      if (zoom < Infinity) {
        // User can't zoom out from the initial frame
        map.setMinZoom(zoom);
      } else {
        map.setZoom(8);
        map.setMinZoom(8);
      }
    }
  }, [mapRef, polygon]);

  useEffect(() => {
    const { current } = mapRef;
    if (current && current.leafletElement) {
      const map = current.leafletElement;
      map.on("click", (event: any) => {
        setMarkerLat(event.latlng.lat);
        setMarkerLng(event.latlng.lng);
        dispatch(
          setDiveLocation({
            lat: event.latlng.lat,
            lng: event.latlng.lng,
          })
        );
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (polygon.type === "Point" && !diveLocation) {
      setMarkerLat(polygon.coordinates[1]);
      setMarkerLng(polygon.coordinates[0]);
      dispatch(
        setDiveLocation({
          lat: polygon.coordinates[1],
          lng: polygon.coordinates[0],
        })
      );
    }
  }, [polygon, diveLocation, dispatch]);

  useEffect(() => {
    if (diveLocation) {
      setMarkerLat(diveLocation.lat);
      setMarkerLng(diveLocation.lng);
    }
  }, [diveLocation]);

  return (
    <Map ref={mapRef} className={classes.map}>
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      {markerLat && markerLng && (
        <Marker icon={pinIcon} position={[markerLat, markerLng]} />
      )}
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
  polygon: Reef["polygon"];
}

type ReefMapProps = WithStyles<typeof styles> & ReefMapIncomingProps;

export default withStyles(styles)(ReefMap);
