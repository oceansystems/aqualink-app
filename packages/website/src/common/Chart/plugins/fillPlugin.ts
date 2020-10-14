const { Chart } = require("react-chartjs-2");

export const fillBetweenLinesPlugin = {
  id: "fillPlugin",
  // TODO we could type options here.
  afterDatasetsDraw: (chart: any, _easingValue: any, options: any) => {
    if (
      chart &&
      chart.chart &&
      chart.scales &&
      options.zeroLevel &&
      options.color
    ) {
      const yScale = chart.scales["y-axis-0"];

      const zero = yScale.getPixelForValue(options.zeroLevel);

      const { ctx } = chart.chart;
      const gradient = ctx.createLinearGradient(0, 0, 0, zero);
      gradient.addColorStop(0, options.color);
      gradient.addColorStop(1, options.color);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      if (
        !chart.data.datasets[options.datasetIndex].backgroundColor ||
        options.updateChart
      ) {
        // eslint-disable-next-line no-param-reassign
        chart.data.datasets[options.datasetIndex].backgroundColor = gradient;
        chart.update();
      }
    }
  },
};

Chart.pluginService.register(fillBetweenLinesPlugin);
