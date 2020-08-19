import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Map, TileLayer, Marker, Popup as LeafletPopup } from "react-leaflet";
import L from "leaflet";
import {
  createStyles,
  withStyles,
  WithStyles,
  CircularProgress,
} from "@material-ui/core";

import {
  reefsListSelector,
  reefsListLoadingSelector,
} from "../../../store/Reefs/reefsListSlice";
import {
  reefOnMapSelector,
  unsetReefOnMap,
} from "../../../store/Homepage/homepageSlice";
import { Reef } from "../../../store/Reefs/types";
import Popup from "./Popup";
import { coloredBuoy } from "./utils";
import {
  colorFinder,
  degreeHeatingWeeksCalculator,
} from "../../../helpers/degreeHeatingWeeks";

const HomepageMap = ({ classes }: HomepageMapProps) => {
  const mapRef = useRef<Map>(null);
  const markerRef = useRef<Marker>(null);
  const dispatch = useDispatch();
  const reefOnMap = useSelector(reefOnMapSelector);
  const reefsList = useSelector(reefsListSelector);
  const loading = useSelector(reefsListLoadingSelector);
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState<number>(2);

  useEffect(() => {
    const { current } = mapRef;
    if (current && current.leafletElement) {
      const map = current.leafletElement;
      const southWest = L.latLng(-90, -240);
      const northEast = L.latLng(90, 240);
      const bounds = L.latLngBounds(southWest, northEast);
      map.setMaxBounds(bounds);
      map.flyTo(center, zoom, { duration: 1 });
    }
  }, [center, zoom, mapRef]);

  // Add Sofar Tiles
  useEffect(() => {
    const { current } = mapRef;
    if (current && current.leafletElement) {
      const map = current.leafletElement;

      const layerControl = L.control.layers(undefined).addTo(map);
      const sofarLayers = [
        {
          name: "Sea Surface Temperature",
          model: "HYCOM",
          variableID: "seaSurfaceTemperature",
          cmap: "turbo",
        },
        {
          name: "NOAA Degree Heating Week",
          model: "NOAACoralReefWatch",
          variableID: "degreeHeatingWeek",
          cmap: "noaacoral",
        },
      ];

      const sofarUrl = "https://api.sofarocean.com/marine-weather/v1/models/";
      const { REACT_APP_SOFAR_API_TOKEN: token } = process.env;
      sofarLayers.forEach((layer) => {
        layerControl.addOverlay(
          L.tileLayer(
            `${sofarUrl}${layer.model}/tile/{z}/{x}/{y}.png?colormap=${layer.cmap}&token=${token}&variableID=${layer.variableID}`,
            { opacity: 0.5 }
          ),
          layer.name
        );
      });
    }
  }, [loading]);

  useEffect(() => {
    const markerCurrent = markerRef.current;
    const mapCurrent = mapRef.current;
    if (
      markerCurrent &&
      markerCurrent.leafletElement &&
      mapCurrent &&
      mapCurrent.leafletElement &&
      reefOnMap?.polygon?.type === "Point"
    ) {
      const map = mapCurrent.leafletElement;
      const marker = markerCurrent.leafletElement;
      map.flyTo(
        [reefOnMap.polygon.coordinates[1], reefOnMap.polygon.coordinates[0]],
        6,
        { duration: 1 }
      );
      marker.openPopup();
    }
  }, [reefOnMap, markerRef, mapRef]);

  return (
    <>
      {loading ? (
        <div className={classes.loading}>
          <CircularProgress size="10rem" thickness={1} />
        </div>
      ) : (
        <Map
          maxBoundsViscosity={1.0}
          className={classes.map}
          ref={mapRef}
          center={center}
          zoom={zoom}
          minZoom={2}
        >
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          {reefOnMap && reefOnMap.polygon.type === "Point" && (
            <Marker
              ref={markerRef}
              icon={L.divIcon({
                iconSize: [24, 24],
                iconAnchor: [8, 48],
                popupAnchor: [3, -48],
                html: `${coloredBuoy(
                  colorFinder(
                    degreeHeatingWeeksCalculator(
                      reefOnMap.latestDailyData.degreeHeatingDays
                    )
                  )
                )}`,
                className: "marker-icon",
              })}
              position={[
                reefOnMap.polygon.coordinates[1],
                reefOnMap.polygon.coordinates[0],
              ]}
            >
              <LeafletPopup closeButton={false} className={classes.popup}>
                <Popup reef={reefOnMap} />
              </LeafletPopup>
            </Marker>
          )}
          {reefsList.length > 0 &&
            reefsList.map((reef: Reef) => {
              if (reef.polygon.type === "Point") {
                const [lng, lat] = reef.polygon.coordinates;
                const { degreeHeatingDays } = reef.latestDailyData || {};
                const color = colorFinder(
                  degreeHeatingWeeksCalculator(degreeHeatingDays)
                );
                return (
                  <Marker
                    onClick={() => {
                      setZoom(6);
                      setCenter([lat, lng]);
                      dispatch(unsetReefOnMap());
                    }}
                    key={reef.id}
                    icon={L.divIcon({
                      iconSize: [24, 24],
                      iconAnchor: [8, 48],
                      popupAnchor: [3, -48],
                      html: `${coloredBuoy(color)}`,
                      className: "marker-icon",
                    })}
                    position={[
                      reef.polygon.coordinates[1],
                      reef.polygon.coordinates[0],
                    ]}
                  >
                    <LeafletPopup closeButton={false} className={classes.popup}>
                      <Popup reef={reef} />
                    </LeafletPopup>
                  </Marker>
                );
              }
              return null;
            })}
        </Map>
      )}
    </>
  );
};

const styles = () =>
  createStyles({
    map: {
      height: "100%",
      width: "100%",
    },
    popup: {
      width: "12vw",
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
