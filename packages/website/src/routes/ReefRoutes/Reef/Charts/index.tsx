import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Typography,
  Grid,
} from "@material-ui/core";
import { Line } from "react-chartjs-2";

import Tooltip, { TooltipData } from "./Tooltip";
import type { Data } from "../../../../store/Reefs/types";
import { createChartData } from "../../../../helpers/createChartData";
import { sortDailyData } from "../../../../helpers/sortDailyData";
import { createDatasets, calculateAxisLimits } from "./utils";
import "../../../../helpers/backgroundPlugin";
import "../../../../helpers/fillPlugin";
import "../../../../helpers/slicePlugin";
import "../../../../helpers/thresholdPlugin";

const Charts = ({ classes, dailyData, temperatureThreshold }: ChartsProps) => {
  const temperatureChartRef = useRef<Line>(null);
  const windChartRef = useRef<Line>(null);
  const waveChartRef = useRef<Line>(null);
  const chartHeight = 60;
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltipData, setTooltipData] = useState<TooltipData>({
    date: "",
    bottomTemperature: 0,
    surfaceTemperature: 0,
    wind: 0,
    windDirection: 0,
    wave: 0,
    wavePeriod: 0,
    waveDirection: 0,
  });
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [updateChart, setUpdateChart] = useState<boolean>(false);
  const [sliceAtLabel, setSliceAtLabel] = useState<string | null>(null);
  const [thresholdTextPosition, setThresholdTextPosition] = useState<number>(0);

  // Sort daily data by date
  const sortByDate = sortDailyData(dailyData);

  const {
    bottomTemperatureData,
    windSpeedData,
    waveHeightData,
  } = createDatasets(sortByDate);

  const { xAxisMax, xAxisMin, chartLabels } = calculateAxisLimits(sortByDate);

  const customTooltip = (ref: React.RefObject<Line>) => (tooltipModel: any) => {
    const chart = ref.current;
    if (!chart) {
      return;
    }
    if (showTooltip) {
      setShowTooltip(false);
      return;
    }
    const position = chart.chartInstance.canvas.getBoundingClientRect();
    const left = position.left + tooltipModel.caretX - 120;
    const top = position.bottom - 300;
    const date =
      tooltipModel.dataPoints &&
      tooltipModel.dataPoints[0] &&
      tooltipModel.dataPoints[0].xLabel;
    const index = date && chartLabels.findIndex((item) => item === date);
    if (index > -1) {
      setTooltipPosition({ top, left });
      setTooltipData({
        date,
        bottomTemperature: bottomTemperatureData[index],
        surfaceTemperature: sortByDate[index].surfaceTemperature,
        wind: windSpeedData[index],
        windDirection: sortByDate[index].windDirection,
        wave: waveHeightData[index],
        wavePeriod: sortByDate[index].wavePeriod,
        waveDirection: sortByDate[index].waveDirection,
      });
      setShowTooltip(true);
      setSliceAtLabel(date);
    }
  };

  const setThreshold = (value: number | null) => {
    const chart = temperatureChartRef.current;

    if (chart) {
      const yScale = chart.chartInstance.scales["y-axis-0"];
      setThresholdTextPosition(yScale.getPixelForValue(value));
    }
  };

  const onResize = useCallback(() => {
    setUpdateChart(true);
    setTimeout(() => {
      setUpdateChart(false);
      setThreshold(temperatureThreshold);
    }, 1);
  }, [temperatureThreshold]);

  // Update chart and set temperature threshold position when window is resized
  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  // Set temperature threshold position on first render
  useEffect(() => {
    setThreshold(temperatureThreshold);
  }, [temperatureThreshold]);

  return (
    <>
      <Grid id="threshold-text-container" item>
        <Grid
          style={{ position: "relative", top: thresholdTextPosition }}
          direction="column"
          container
        >
          <Typography variant="caption">Bleaching</Typography>
          <Typography variant="caption">Threshold</Typography>
          <Typography variant="caption">(Mean)</Typography>
        </Grid>
      </Grid>
      <Grid item xs={9}>
        <div className={classes.root}>
          <Typography
            style={{ marginLeft: "4rem", fontWeight: "normal" }}
            variant="h6"
          >
            MEAN DAILY WATER TEMPERATURE AT 25M (C&deg;)
          </Typography>
          <Line
            ref={temperatureChartRef}
            options={{
              plugins: {
                chartJsPluginBarchartBackground: {
                  color: "rgb(158, 166, 170, 0.07)",
                },
                fillPlugin: {
                  datasetIndex: 0,
                  zeroLevel: temperatureThreshold,
                  bottom: 0,
                  top: 35,
                  color: "rgba(250, 141, 0, 1)",
                  updateChart,
                },
                sliceDrawPlugin: {
                  sliceAtLabel,
                  datasetIndex: 0,
                },
                thresholdPlugin: {
                  threshold: temperatureThreshold,
                },
              },
              tooltips: {
                filter: (tooltipItem: any) => {
                  return tooltipItem.datasetIndex === 0;
                },
                enabled: false,
                custom: customTooltip(temperatureChartRef),
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
                      display: false,
                      min: xAxisMin,
                      max: xAxisMax,
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
                      stepSize: 5,
                      max: 40,
                      callback: (value: number) => {
                        return `  ${value}\u00B0   `;
                      },
                    },
                  },
                ],
              },
            }}
            height={chartHeight}
            data={createChartData(
              chartLabels,
              bottomTemperatureData,
              0.6,
              3,
              true
            )}
          />
          <Typography
            style={{ margin: "2rem 0 0 4rem", fontWeight: "normal" }}
            variant="h6"
          >
            MEAN DAILY WIND SPEED (KPH)
          </Typography>
          <Line
            ref={windChartRef}
            options={{
              plugins: {
                chartJsPluginBarchartBackground: {
                  color: "rgb(158, 166, 170, 0.07)",
                },
                sliceDrawPlugin: {
                  sliceAtLabel,
                  datasetIndex: 0,
                },
              },
              tooltips: {
                filter: (tooltipItem: any) => {
                  return tooltipItem.datasetIndex === 0;
                },
                enabled: false,
                custom: customTooltip(windChartRef),
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
                      display: false,
                      min: xAxisMin,
                      max: xAxisMax,
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
                      stepSize: 1,
                      max: 5,
                      callback: (value: number) => {
                        return `${value}kph  `;
                      },
                    },
                  },
                ],
              },
            }}
            height={0.5 * chartHeight}
            data={createChartData(chartLabels, windSpeedData, 0.3, 3, false)}
          />
          <Typography
            style={{ margin: "2rem 0 0 4rem", fontWeight: "normal" }}
            variant="h6"
          >
            MEAN DAILY WAVE HEIGHT (M)
          </Typography>
          <Line
            ref={waveChartRef}
            options={{
              plugins: {
                chartJsPluginBarchartBackground: {
                  color: "rgb(158, 166, 170, 0.07)",
                  xTicksFontWeight: 1.2,
                },
                sliceDrawPlugin: {
                  sliceAtLabel,
                  datasetIndex: 0,
                },
              },
              tooltips: {
                filter: (tooltipItem: any) => {
                  return tooltipItem.datasetIndex === 0;
                },
                enabled: false,
                custom: customTooltip(waveChartRef),
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
                      stepSize: 1,
                      max: 5,
                      callback: (value: number) => {
                        return `    ${value}m  `;
                      },
                    },
                  },
                ],
              },
            }}
            height={0.5 * chartHeight}
            data={createChartData(chartLabels, waveHeightData, 0.3, 3, false)}
          />
          {showTooltip ? (
            <div
              onMouseLeave={() => {
                setShowTooltip(false);
                setSliceAtLabel(null);
              }}
              className="chart-tooltip"
              id="chart-tooltip"
              style={{
                position: "fixed",
                top: tooltipPosition.top,
                left: tooltipPosition.left,
              }}
            >
              <>
                <Tooltip {...tooltipData} />
                <div className="tooltip-arrow" />
              </>
            </div>
          ) : null}
        </div>
      </Grid>
    </>
  );
};

const styles = () =>
  createStyles({
    root: {
      height: "100%",
    },
  });

interface ChartsIncomingProps {
  dailyData: Data[];
  temperatureThreshold: number | null;
}

type ChartsProps = ChartsIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(Charts);
