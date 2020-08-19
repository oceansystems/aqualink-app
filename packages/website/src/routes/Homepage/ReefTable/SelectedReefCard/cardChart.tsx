import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const chartRef = useRef<Line>(null);
  const [xTickShift, setXTickShift] = useState<number>(0);

  // Sort daily data by date
  const sortByDate = sortDailyData(dailyData);

  const { surfaceTemperatureData } = createDatasets(sortByDate);

  const { xAxisMax, xAxisMin, chartLabels } = calculateAxisLimits(sortByDate);

  const changeXTickShift = () => {
    const { current } = chartRef;
    if (current) {
      const xScale = current.chartInstance.scales["x-axis-0"];
      const ticksPositions = xScale.ticks.map((_: any, index: number) =>
        xScale.getPixelForTick(index)
      );
      setXTickShift((ticksPositions[2] - ticksPositions[1]) / 2);
    }
  };

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

  useEffect(() => {
    changeXTickShift();
  });

  return (
    <Line
      ref={chartRef}
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
                unit: "month",
              },
              ticks: {
                labelOffset: xTickShift,
                min: xAxisMin,
                max: xAxisMax,
                padding: 10,
                maxRotation: 0,
                callback: (value: string) => {
                  return value.split(", ")[0].toUpperCase();
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
      data={createChartData(chartLabels, surfaceTemperatureData, 0, true)}
    />
  );
};

interface CardChartProps {
  dailyData: Data[];
  temperatureThreshold: number | null;
}

export default CardChart;
