import { useDispatch, useSelector } from "react-redux";
import { LayerGroup, Marker, useLeaflet } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import React, { useEffect } from "react";
import L from "leaflet";
import { reefsListSelector } from "../../../../store/Reefs/reefsListSlice";
import { Reef } from "../../../../store/Reefs/types";
import {
  reefOnMapSelector,
  setReefOnMap,
} from "../../../../store/Homepage/homepageSlice";
import Popup from "../Popup";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import {
  findIntervalByLevel,
  alertIconFinder,
  findMaxLevel,
  getColorByLevel,
  Interval,
} from "../../../../helpers/bleachingAlertIntervals";

/**
 * Dummy component to listen for changes in the active reef/reefOnMap state and initiate the popup/fly-to. This is a
 * separate component to prevent trigger any leaflet element re-rendering.
 */
const ActiveReefListener = ({ reef }: { reef: Reef }) => {
  const { map, popupContainer } = useLeaflet();
  const reefOnMap = useSelector(reefOnMapSelector);

  useEffect(() => {
    if (
      map &&
      popupContainer &&
      reefOnMap?.polygon.type === "Point" &&
      reefOnMap.id === reef.id
    ) {
      const setCenter = (latLng: [number, number], zoom: number) => {
        const newZoom = Math.max(map?.getZoom() || 6, zoom);
        return map?.flyTo(latLng, newZoom, { duration: 2 });
      };

      setCenter(
        [reefOnMap.polygon.coordinates[1], reefOnMap.polygon.coordinates[0]],
        6
      );
      const openPopup = () => {
        popupContainer.openPopup();
        map.off("moveend", openPopup);
      };
      map.on("moveend", openPopup);
    }
  }, [reefOnMap, reef.id, map, popupContainer]);
  return null;
};

const buoyIcon = (iconUrl: string) =>
  new L.Icon({
    iconUrl,
    iconSize: [24, 27],
    iconAnchor: [12, 27],
    popupAnchor: [0, -28],
  });

const clusterIcon = (cluster: any) => {
  const alerts: Interval[] = cluster.getAllChildMarkers().map((marker: any) => {
    const { reef } = marker.options.children[0].props;
    const { weeklyAlertLevel } = reef.latestDailyData;
    return findIntervalByLevel(weeklyAlertLevel);
  });
  const color = getColorByLevel(findMaxLevel(alerts));
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div style="background-color: ${color}"><span>${count}</span></div>`,
    className: `leaflet-marker-icon marker-cluster custom-cluster-icon marker-cluster-small leaflet-zoom-animated leaflet-interactive`,
    iconSize: L.point(40, 40, true),
  });
};

export const ReefMarkers = () => {
  const reefsList = useSelector(reefsListSelector);
  const dispatch = useDispatch();

  // To make sure we can see all the reefs all the time, and especially
  // around -180/+180, we create dummy copies of each reef.
  const lngOffsets = [-360, 0, 360];

  return (
    <LayerGroup>
      <MarkerClusterGroup
        iconCreateFunction={clusterIcon}
        disableClusteringAtZoom={2}
      >
        {reefsList.map((reef: Reef) => {
          if (reef.polygon.type === "Point") {
            const [lng, lat] = reef.polygon.coordinates;
            const { weeklyAlertLevel } = reef.latestDailyData || {};

            return lngOffsets.map((offset) => (
              <Marker
                onClick={() => {
                  dispatch(setReefOnMap(reef));
                }}
                key={`${reef.id}-${offset}`}
                icon={buoyIcon(alertIconFinder(weeklyAlertLevel))}
                position={[lat, lng + offset]}
              >
                <ActiveReefListener reef={reef} />
                <Popup reef={reef} />
              </Marker>
            ));
          }
          return null;
        })}
      </MarkerClusterGroup>
    </LayerGroup>
  );
};

export default ReefMarkers;
