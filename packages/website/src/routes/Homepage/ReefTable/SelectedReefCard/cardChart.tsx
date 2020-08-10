import React, { useState, useEffect, useCallback } from "react";
import { Line } from "react-chartjs-2";

import { createChartData } from "../../../../helpers/createChartData";
import { sortDailyData } from "../../../../helpers/sortDailyData";
import type { Data } from "../../../../store/Reefs/types";
import {
  createDatasets,
  calculateAxisLimits,
} from "../../../ReefRoutes/Reef/Charts/utils";

import "../../../../helpers/backgroundPlugin";
import "../../../../helpers/fillPlugin";

const CardChart = ({ dailyData, temperatureThreshold }: CardChartProps) => {
  const [updateChart, setUpdateChart] = useState<boolean>(false);

  // Sort daily data by date
  const sortByDate = sortDailyData(dailyData);

  const { bottomTemperatureData } = createDatasets(sortByDate);

  const { xAxisMax, xAxisMin, chartLabels } = calculateAxisLimits(sortByDate);

  const onResize = useCallback(() => {
    setUpdateChart(true);
    setTimeout(() => {
      setUpdateChart(false);
    }, 1);
  }, []);

  // Update chart and set temperature threshold position when window is resized
  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  return (
    <Line
      options={{
        plugins: {
          chartJsPluginBarchartBackground: {
            color: "rgb(158, 166, 170, 0.07)",
            xTicksFontWeight: 2.8,
          },
          fillPlugin: {
            datasetIndex: 0,
            zeroLevel: temperatureThreshold,
            bottom: 0,
            top: 35,
            color: "rgba(250, 141, 0, 1)",
            updateChart,
          },
        },
        tooltips: {
          enabled: false,
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                displayFormats: {
                  hour: "MMM D h:mm a",
                },
              },
              ticks: {
                min: xAxisMin,
                max: xAxisMax,
                padding: 10,
                maxRotation: 0,
                callback: (value: string) => {
                  const splitDate = value.split(" ");
                  if (splitDate[2] === "12:00" && splitDate[3] === "pm") {
                    return `${splitDate[0]} ${splitDate[1]}`;
                  }
                  return null;
                },
              },
              gridLines: {
                display: false,
                drawTicks: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                drawTicks: false,
              },
              display: true,
              ticks: {
                min: 0,
                stepSize: 20,
                max: 40,
                callback: (value: number) => {
                  return `${value}\u00B0 `;
                },
              },
            },
          ],
        },
      }}
      height={100}
      data={createChartData(chartLabels, bottomTemperatureData, 0.6, 0, true)}
    />
  );
};

interface CardChartProps {
  dailyData: Data[];
  temperatureThreshold: number | null;
}

export default CardChart;
