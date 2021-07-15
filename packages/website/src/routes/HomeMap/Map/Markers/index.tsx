import { useSelector } from "react-redux";
import { LayerGroup, useLeaflet } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import React, { useCallback, useEffect } from "react";
import L from "leaflet";
import { reefsToDisplayListSelector } from "../../../../store/Reefs/reefsListSlice";
import { Reef } from "../../../../store/Reefs/types";
import { reefOnMapSelector } from "../../../../store/Homepage/homepageSlice";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import {
  findIntervalByLevel,
  findMaxLevel,
  getColorByLevel,
  Interval,
} from "../../../../helpers/bleachingAlertIntervals";
import { CollectionDetails } from "../../../../store/Collection/types";
import ReefMarker from "./ReefMarker";

const clusterIcon = (cluster: any) => {
  const alerts: Interval[] = cluster.getAllChildMarkers().map((marker: any) => {
    const { reef } = marker?.options?.children?.[0]?.props || {};
    const { weeklyAlert } = reef?.collectionData || {};
    return findIntervalByLevel(weeklyAlert);
  });
  const color = getColorByLevel(findMaxLevel(alerts));
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div style="background-color: ${color}"><span>${count}</span></div>`,
    className: `leaflet-marker-icon marker-cluster custom-cluster-icon marker-cluster-small leaflet-zoom-animated leaflet-interactive`,
    iconSize: L.point(40, 40, true),
  });
};

export const ReefMarkers = ({ collection }: ReefMarkersProps) => {
  const storedReefs = useSelector(reefsToDisplayListSelector);
  const reefsList = collection?.reefs || storedReefs || [];
  const reefOnMap = useSelector(reefOnMapSelector);
  const { map } = useLeaflet();

  const setCenter = useCallback(
    (inputMap: L.Map, latLng: [number, number], zoom: number) => {
      const maxZoom = Math.max(inputMap.getZoom() || 6, zoom);
      const pointBounds = L.latLngBounds(latLng, latLng);
      inputMap.flyToBounds(pointBounds, {
        duration: 2,
        maxZoom,
        paddingTopLeft: L.point(0, 200),
      });
    },
    []
  );
  // zoom in and center on reef marker when it's clicked
  useEffect(() => {
    if (map && reefOnMap?.polygon.type === "Point") {
      const [lng, lat] = reefOnMap.polygon.coordinates;
      setCenter(map, [lat, lng], 6);
    }
  }, [map, reefOnMap, setCenter]);

  return (
    <LayerGroup>
      <MarkerClusterGroup
        iconCreateFunction={clusterIcon}
        disableClusteringAtZoom={1}
      >
        {reefsList.map((reef: Reef) => (
          <ReefMarker key={reef.id} reef={reef} />
        ))}
      </MarkerClusterGroup>
    </LayerGroup>
  );
};

interface ReefMarkersProps {
  collection?: CollectionDetails;
}

ReefMarkers.defaultProps = {
  collection: undefined,
};

export default ReefMarkers;
