import React, { useRef, useEffect, useCallback } from "react";
import { Map, TileLayer, Polygon, Marker } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import L from "leaflet";
import "./plugins/leaflet-tilelayer-subpixel-fix";
import { withStyles, WithStyles, createStyles } from "@material-ui/core";

import SurveyPointPopup from "./SurveyPointPopup";
import {
  Reef,
  Position,
  SpotterPosition,
  Pois,
} from "../../../store/Reefs/types";
import { mapBounds } from "../../../helpers/mapBounds";

import marker from "../../../assets/marker.png";
import buoy from "../../../assets/buoy-marker.svg";
import {
  reefDraftSelector,
  setReefDraft,
} from "../../../store/Reefs/selectedReefSlice";
import { userInfoSelector } from "../../../store/User/userSlice";
import { isManager } from "../../../helpers/user";

const pinIcon = L.icon({
  iconUrl: marker,
  iconSize: [20, 30],
  iconAnchor: [10, 30],
  popupAnchor: [0, -41],
});

const buoyIcon = L.icon({
  iconUrl: buoy,
  iconSize: [30, 40],
  iconAnchor: [10, 30],
  popupAnchor: [0, -41],
});

const surveyPointIcon = (pointId: number) =>
  L.divIcon({
    className: "leaflet-numbered-marker",
    iconSize: [36, 40.5],
    iconAnchor: [18, 40.5],
    popupAnchor: [0, -40.5],
    html: `<span class="leaflet-numbered-marker-text">${pointId}</span>`,
  });

const ReefMap = ({
  reefId,
  spotterPosition,
  polygon,
  surveyPoints,
  classes,
}: ReefMapProps) => {
  const dispatch = useDispatch();
  const mapRef = useRef<Map>(null);
  const markerRef = useRef<Marker>(null);
  const draftReef = useSelector(reefDraftSelector);
  const user = useSelector(userInfoSelector);

  const reverseCoords = (coordArray: Position[]): [Position[]] => {
    return [coordArray.map((coords) => [coords[1], coords[0]])];
  };

  useEffect(() => {
    const { current } = mapRef;
    if (current && current.leafletElement) {
      const map = current.leafletElement;
      // Initialize map's position to fit the given polygon
      if (polygon.type === "Polygon") {
        map.fitBounds(mapBounds(polygon));
      } else if (draftReef?.coordinates) {
        map.panTo(
          new L.LatLng(
            draftReef.coordinates.latitude || polygon.coordinates[1],
            draftReef.coordinates.longitude || polygon.coordinates[0]
          )
        );
      } else {
        map.panTo(new L.LatLng(polygon.coordinates[1], polygon.coordinates[0]));
      }
    }
  }, [mapRef, draftReef, polygon]);

  const handleDragChange = useCallback(() => {
    const { current } = markerRef;
    if (current && current.leafletElement) {
      const mapMarker = current.leafletElement;
      const { lat, lng } = mapMarker.getLatLng().wrap();
      dispatch(
        setReefDraft({
          coordinates: {
            latitude: lat,
            longitude: lng,
          },
        })
      );
    }
  }, [dispatch]);

  return (
    <Map
      ref={mapRef}
      zoom={13}
      dragging
      scrollWheelZoom={false}
      className={classes.map}
    >
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      {polygon.type === "Polygon" ? (
        <Polygon positions={reverseCoords(...polygon.coordinates)} />
      ) : (
        <>
          <Marker
            ref={markerRef}
            draggable={Boolean(draftReef)}
            ondragend={handleDragChange}
            icon={pinIcon}
            position={[
              draftReef?.coordinates?.latitude || polygon.coordinates[1],
              draftReef?.coordinates?.longitude || polygon.coordinates[0],
            ]}
          />
          {surveyPoints.map(
            (point) =>
              point.coordinates && (
                <Marker
                  key={point.id}
                  icon={surveyPointIcon(point.id)}
                  position={[point.coordinates[1], point.coordinates[0]]}
                >
                  <SurveyPointPopup reefId={reefId} point={point} />
                </Marker>
              )
          )}
        </>
      )}
      {!draftReef && spotterPosition && isManager(user) && (
        <Marker
          icon={buoyIcon}
          position={[
            spotterPosition.latitude.value,
            spotterPosition.longitude.value,
          ]}
        />
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
  reefId: number;
  polygon: Reef["polygon"];
  spotterPosition?: SpotterPosition | null;
  surveyPoints: Pois[];
}

ReefMap.defaultProps = {
  spotterPosition: null,
};

type ReefMapProps = WithStyles<typeof styles> & ReefMapIncomingProps;

export default withStyles(styles)(ReefMap);