export const createChartData = (
  labels: string[],
  dataArray: number[],
  pointRadius: number,
  fill: boolean
) => ({
  labels,
  datasets: [
    {
      label: "BLEACHING THRESHOLD",
      data: dataArray,
      fill,
      borderColor: "#6bc1e1",
      borderWidth: 2,
      pointBackgroundColor: "#ffffff",
      pointBorderWidth: 1.5,
      pointRadius,
      cubicInterpolationMode: "monotone",
    },
    {
      label: "SURFACE TEMP",
      data: dataArray,
      backgroundColor: "rgb(107,193,225,0.4)",
      borderColor: "#6bc1e1",
      borderWidth: 2,
      pointBackgroundColor: "#ffffff",
      pointBorderWidth: 1.5,
      pointRadius,
      cubicInterpolationMode: "monotone",
    },
  ],
});
