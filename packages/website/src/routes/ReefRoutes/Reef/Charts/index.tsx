import React from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Typography,
} from "@material-ui/core";
import { Line } from "react-chartjs-2";
require("../../../../helpers/chartPlugin")

const Charts = ({ classes }: ChartsProps) => {
  const data = (canvas: HTMLCanvasElement) => {
    const graphHeight = 261;
    const offset = 8;
    const threshold = 33;
    const percentage = (35 - threshold) / 8;
    const ctx = canvas.getContext("2d");
    let overflowGradient;
    let gradient;
    if (ctx) {
      overflowGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        percentage * graphHeight + offset
      );
      // overflowGradient.addColorStop(0, "rgba(250, 141, 0, 1)");
      // overflowGradient.addColorStop(1, "rgba(250, 141, 0, 1)");
      overflowGradient.addColorStop(1, "rgba(250, 141, 0, 0)");
      gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgba(22, 141, 189, 0.29)");
      gradient.addColorStop(0.6, "rgba(22, 141, 189, 0)");
    }

    const dataArray = [32.4, 32.7, 32.5, 32.7, 32.7, 33.5, 34.1, 34.3];
    const thresholdArray = Array(8).fill(threshold);

    return {
      labels: [
        "MAY 1",
        "MAY 2",
        "MAY 3",
        "MAY 4",
        "MAY 5",
        "MAY 6",
        "MAY 7",
        "MAY 8",
      ],
      datasets: [
        {
          label: "Mean Water Temperature",
          data: dataArray,
          backgroundColor: overflowGradient,
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1.5,
          pointBackgroundColor: "#ffffff",
          pointBorderWidth: 1.5,
          pointRadius: 3,
          cubicInterpolationMode: "monotone",
        },
        {
          label: "Mean Water Temperature",
          data: dataArray,
          backgroundColor: gradient,
          borderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#ffffff",
          pointBorderWidth: 0,
          pointRadius: 0,
          cubicInterpolationMode: "monotone",
        },
        {
          fill: false,
          data: thresholdArray,
          fillBetweenSet: 0,
          fillBetweenColor: "#FA8D00",
          borderColor: "#212121",
          borderDash: [8, 5],
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    };
  };

  return (
    <div className={classes.root}>
      <Typography
        style={{ marginLeft: "4rem", fontWeight: "normal" }}
        variant="h6"
      >
        MEAN DAILY WATER TEMPERATURE AT 25M (C&deg;)
      </Typography>
      <Line
        options={{
          responsive: true,
          tooltips: {
            filter: (tooltipItem: any) => {
              return tooltipItem.datasetIndex === 0;
            },
          },
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  padding: 10,
                  labelOffset: -100,
                },
              },
            ],
            yAxes: [
              {
                display: true,
                ticks: {
                  steps: 4,
                  min: 27,
                  stepSize: 1,
                  max: 35,
                  callback: (value: number) => {
                    if (value % 2 === 1) {
                      return `    ${value}\u00B0`;
                    }
                    return null;
                  },
                },
              },
            ],
          },
        }}
        height={65}
        data={data}
      />
    </div>
  );
};

const styles = () =>
  createStyles({
    root: {
      height: "100%",
    },
  });

type ChartsProps = WithStyles<typeof styles>;

export default withStyles(styles)(Charts);
