import React from "react";
import { LayersControl, TileLayer } from "react-leaflet";

type SofarLayerDefinition = {
  name: string;
  model: string;
  variableId: string;
  cmap: string;
};

const SOFAR_LAYERS: SofarLayerDefinition[] = [
  {
    name: "Sea Surface Temperature",
    model: "NOAACoralReefWatch",
    variableId: "analysedSeaSurfaceTemperature",
    cmap: "turbo",
  },
  {
    name: "Heat Stress",
    model: "NOAACoralReefWatch",
    variableId: "degreeHeatingWeek",
    cmap: "noaacoral",
  },
];

const { REACT_APP_SOFAR_API_TOKEN: API_TOKEN } = process.env;

const sofarUrlFromDef = ({ model, cmap, variableId }: SofarLayerDefinition) =>
  `https://api.sofarocean.com/marine-weather/v1/models/${model}/tile/{z}/{x}/{y}.png?colormap=${cmap}&token=${API_TOKEN}&variableID=${variableId}`;

export const SofarLayers = () => {
  return (
    <LayersControl position="topright">
      <LayersControl.BaseLayer checked name="Satellite Imagery" key="no-verlay">
        <TileLayer url="" key="no-overlay" />
      </LayersControl.BaseLayer>
      {SOFAR_LAYERS.map((def) => (
        <LayersControl.BaseLayer name={def.name} key={def.name}>
          <TileLayer
            // Sofar tiles have a max native zoom of 9
            maxNativeZoom={9}
            url={sofarUrlFromDef(def)}
            key={def.variableId}
            opacity={0.5}
          />
        </LayersControl.BaseLayer>
      ))}
    </LayersControl>
  );
};

export default SofarLayers;
