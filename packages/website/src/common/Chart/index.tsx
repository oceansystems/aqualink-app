import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Line } from "react-chartjs-2";
import { mergeWith } from "lodash";
import type { Data } from "../../store/Reefs/types";
import "./backgroundPlugin";
import "./fillPlugin";
import "./slicePlugin";
import "chartjs-plugin-annotation";
import { createChartData } from "../../helpers/createChartData";
import { useProcessedChartData } from "./useProcessedChartData";

export interface ChartProps {
  dailyData: Data[];
  temperatureThreshold: number | null;
  maxMonthlyMean?: number | null;

  chartHeight?: number;
  chartSettings?: {};
  chartRef?: MutableRefObject<Line | null>;
}

function Chart({
  dailyData,
  temperatureThreshold,
  maxMonthlyMean = temperatureThreshold ? temperatureThreshold - 1 : null,
  chartHeight = 100,
  chartSettings = {},
  chartRef: forwardRef,
}: ChartProps) {
  const chartRef = useRef<Line>(null);
  if (forwardRef) {
    // this might be doable with forwardRef or callbacks, but its a little hard since we need to
    // use it in two places
    // eslint-disable-next-line no-param-reassign
    forwardRef.current = chartRef.current;
  }
  const [updateChart, setUpdateChart] = useState<boolean>(false);

  const [xTickShift, setXTickShift] = useState<number>(0);

  const {
    xAxisMax,
    xAxisMin,
    yAxisMax,
    yAxisMin,
    surfaceTemperatureData,
    chartLabels,
  } = useProcessedChartData(dailyData, temperatureThreshold);

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

  /*
      Catch the "window done resizing" event as suggested by https://css-tricks.com/snippets/jquery/done-resizing-event/
    */
  const onResize = useCallback(() => {
    setUpdateChart(true);
    setTimeout(() => {
      // Resize has stopped so stop updating the chart
      setUpdateChart(false);
      changeXTickShift();
    }, 1);
  }, []);

  // Update chart when window is resized
  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  useEffect(() => {
    changeXTickShift();
  });
  const settings = mergeWith(
    {
      maintainAspectRatio: false,
      plugins: {
        chartJsPluginBarchartBackground: {
          color: "rgb(158, 166, 170, 0.07)",
        },
        fillPlugin: {
          datasetIndex: 0,
          zeroLevel: temperatureThreshold,
          bottom: 0,
          top: 35,
          color: "rgba(250, 141, 0, 0.5)",
          updateChart,
        },
      },
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      },

      annotation: {
        annotations: [
          {
            type: "line",
            mode: "horizontal",
            scaleID: "y-axis-0",
            value: maxMonthlyMean,
            borderColor: "rgb(75, 192, 192)",
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              enabled: true,
              backgroundColor: "rgb(169,169,169)",
              position: "left",
              xAdjust: 10,
              content: "Historical Max",
            },
          },
        ],
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              displayFormats: {
                hour: "MMM D h:mm a",
              },
              unit: "week",
            },
            display: true,
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
              min: yAxisMin,
              stepSize: 5,
              max: yAxisMax,
              callback: (value: number) => {
                return `${value}\u00B0  `;
              },
            },
          },
        ],
      },
    },
    chartSettings,
    (el: any, toMerge: any) => {
      if (Array.isArray(el)) {
        return el.concat(toMerge);
      }
      return undefined;
    }
  );
  // TODO remove console.log(settings, chartSettings);
  return (
    <Line
      ref={chartRef}
      options={settings}
      height={chartHeight}
      data={createChartData(chartLabels, surfaceTemperatureData, true)}
    />
  );
}

export default Chart;
