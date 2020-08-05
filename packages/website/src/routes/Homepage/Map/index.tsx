import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Map, TileLayer, Marker, Popup as LeafletPopup } from "react-leaflet";
import L from "leaflet";
import { createStyles, withStyles, WithStyles } from "@material-ui/core";

import { reefsListSelector } from "../../../store/Reefs/reefsListSlice";
import {
  reefOnMapSelector,
  unsetReefOnMap,
} from "../../../store/Homepage/homepageSlice";
import mapServices from "../../../services/mapServices";
import { Reef } from "../../../store/Reefs/types";
import Popup from "./Popup";

import pin from "../../../assets/buoy.png";

const pinIcon = L.icon({
  iconUrl: pin,
  iconSize: [24, 24],
  iconAnchor: [8, 48],
  popupAnchor: [3, -48],
});

const HomepageMap = ({ classes }: HomepageMapProps) => {
  const mapRef = useRef<Map>(null);
  const markerRef = useRef<Marker>(null);
  const dispatch = useDispatch();
  const reefOnMap = useSelector(reefOnMapSelector);
  const reefsList = useSelector(reefsListSelector);
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState<number>(2);

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

  useEffect(() => {
    const { current } = mapRef;
    if (current && current.leafletElement) {
      const map = current.leafletElement;
      const southWest = L.latLng(-90, -240);
      const northEast = L.latLng(90, 240);
      const bounds = L.latLngBounds(southWest, northEast);
      map.setMaxBounds(bounds);
      map.flyTo(center, zoom, { duration: 1 });

      // Add Sofar Tiles
      const layerControl = L.control.layers(undefined).addTo(map);
      sofarLayers.forEach((layer) => {
        mapServices.getModelTimes(layer.model).then(({ data }) => {
          const timestamp = data.outputTimes[0];
          layerControl.addOverlay(
            L.tileLayer(
              `${process.env.REACT_APP_SOFAR_API_BASE_URL}${layer.model}/tile/{z}/{x}/{y}.png?colormap=${layer.cmap}&token=383d59964809ca8c6438867e590f16&variableID=${layer.variableID}&timestamp=${timestamp}`,
              { opacity: 0.5 }
            ),
            layer.name
          );
        });
      });
    }
  }, [center, zoom, mapRef]);

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
          icon={pinIcon}
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
            return (
              <Marker
                onClick={() => {
                  setZoom(6);
                  setCenter([lat, lng]);
                  dispatch(unsetReefOnMap());
                }}
                key={reef.id}
                icon={pinIcon}
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
  });

type HomepageMapProps = WithStyles<typeof styles>;

export default withStyles(styles)(HomepageMap);
