const { Chart } = require("react-chartjs-2");

export const thresholdPlugin = {
  id: "thresholdPlugin",
  afterDatasetsDraw: (chart: any, _easingValue: any, options: any) => {
    const yScale = chart.scales["y-axis-0"];
    const xScale = chart.scales["x-axis-0"];

    const { left, right } = xScale;
    const { ctx } = chart;
    const yCoord = yScale.getPixelForValue(options.threshold);
    let xCoord = left;

    ctx.beginPath();
    while (xCoord < right - 5) {
      ctx.moveTo(xCoord, yCoord);
      ctx.lineTo(xCoord + 5, yCoord);
      ctx.strokeStyle = "#ff8d00";
      ctx.fill();
      xCoord += 10;
    }
    ctx.closePath();
    ctx.stroke();
  },
};

Chart.pluginService.register(thresholdPlugin);
