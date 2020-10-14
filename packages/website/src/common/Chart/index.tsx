import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Line } from "react-chartjs-2";
import { mergeWith } from "lodash";
import type { DailyData } from "../../store/Reefs/types";
import "./plugins/backgroundPlugin";
import "./plugins/fillPlugin";
import "./plugins/slicePlugin";
import "chartjs-plugin-annotation";
import { createChartData } from "../../helpers/createChartData";
import { useProcessedChartData } from "./utils";
import { SurveyListItem } from "../../store/Survey/types";

export interface ChartProps {
  dailyData: DailyData[];
  surveys: SurveyListItem[];
  temperatureThreshold: number | null;
  maxMonthlyMean: number | null;

  chartSettings?: {};
  chartRef?: MutableRefObject<Line | null>;
}

const SMALL_WINDOW = 400;

function Chart({
  dailyData,
  surveys,
  temperatureThreshold,
  maxMonthlyMean,
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

  const [xPeriod, setXPeriod] = useState<"week" | "month">("week");

  const {
    xAxisMax,
    xAxisMin,
    yAxisMax,
    yAxisMin,
    surfaceTemperatureData,
    tempWithSurvey,
    chartLabels,
  } = useProcessedChartData(dailyData, surveys, temperatureThreshold);

  const changeXTickShiftAndPeriod = () => {
    const { current } = chartRef;
    if (current) {
      const xScale = current.chartInstance.scales["x-axis-0"];
      const ticksPositions = xScale.ticks.map((_: any, index: number) =>
        xScale.getPixelForTick(index)
      );
      if (xScale.width > SMALL_WINDOW) {
        setXTickShift((ticksPositions[2] - ticksPositions[1]) / 2);
        setXPeriod("week");
      } else {
        setXPeriod("month");
        setXTickShift(0);
      }
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
      changeXTickShiftAndPeriod();
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
    changeXTickShiftAndPeriod();
  });
  const settings = mergeWith(
    {
      layout: {
        padding: { right: 10 },
      },
      maintainAspectRatio: false,
      plugins: {
        chartJsPluginBarchartBackground: {
          color: "rgb(158, 166, 170, 0.07)",
        },
        fillPlugin: {
          datasetIndex: 1,
          zeroLevel: temperatureThreshold,
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
              backgroundColor: "rgb(169,169,169, 0.7)",
              yPadding: 3,
              xPadding: 3,
              position: "left",
              xAdjust: 10,
              content: "Historical Max",
            },
          },
          {
            type: "line",
            mode: "horizontal",
            scaleID: "y-axis-0",
            value: temperatureThreshold,
            borderColor: "#ff8d00",
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              enabled: true,
              backgroundColor: "rgb(169,169,169, 0.7)",
              yPadding: 3,
              xPadding: 3,
              position: "left",
              xAdjust: 10,
              content: "Bleaching Threshold",
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
                week: "MMM D",
                month: "MMM",
              },
              unit: xPeriod,
            },
            display: true,
            ticks: {
              labelOffset: xTickShift,
              min: xAxisMin,
              max: xAxisMax,
              padding: 10,
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
    // makes sure arrays are merged correctly
    (el: any, toMerge: any) => {
      if (Array.isArray(el)) {
        return el.concat(toMerge);
      }
      return undefined;
    }
  );
  return (
    <Line
      ref={chartRef}
      options={settings}
      data={createChartData(
        chartLabels,
        tempWithSurvey,
        surfaceTemperatureData,
        Boolean(temperatureThreshold)
      )}
    />
  );
}

export default Chart;
