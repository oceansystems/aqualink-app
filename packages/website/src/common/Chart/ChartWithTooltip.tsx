import React, {
  CSSProperties,
  PropsWithChildren,
  useRef,
  useState,
} from "react";
import { Line } from "react-chartjs-2";
import Chart, { ChartProps } from "./index";
import Tooltip, { TooltipData } from "./Tooltip";
import { useProcessedChartData } from "./utils";

interface ChartWithTooltipProps extends ChartProps {
  depth: number | null;
  className?: string;
  style?: CSSProperties;
}

function ChartWithTooltip({
  depth,
  dailyData,
  temperatureThreshold,
  chartSettings,
  children,
  className,
  style,
  ...rest
}: PropsWithChildren<ChartWithTooltipProps>) {
  const chartDataRef = useRef<Line>(null);
  const {
    chartLabels,
    bottomTemperatureData,
    surfaceTemperatureData,
  } = useProcessedChartData(dailyData, temperatureThreshold);

  const [sliceAtLabel, setSliceAtLabel] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltipData, setTooltipData] = useState<TooltipData>({
    date: "",
    depth,
    bottomTemperature: 0,
    surfaceTemperature: 0,
  });
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const customTooltip = (ref: React.RefObject<Line>) => (tooltipModel: any) => {
    const chart = ref.current;
    if (!chart) {
      return;
    }
    const position = chart.chartInstance.canvas.getBoundingClientRect();
    const left = position.left + tooltipModel.caretX - 100;
    const top = position.top + tooltipModel.caretY - 110;
    const date = tooltipModel.dataPoints?.[0]?.xLabel;
    const index = date && chartLabels.findIndex((item) => item === date);

    if (index > -1 && index !== 0) {
      setTooltipPosition({ top, left });
      setTooltipData({
        date,
        depth,
        bottomTemperature: bottomTemperatureData[index],
        surfaceTemperature: surfaceTemperatureData[index],
      });
      setShowTooltip(true);
      setSliceAtLabel(date);
    }
  };

  const hideTooltip = () => {
    setShowTooltip(false);
    setSliceAtLabel(null);
  };
  // Hide tooltip on scroll to avoid dragging it on the page.
  if (showTooltip) {
    window.addEventListener("scroll", hideTooltip);
  }

  return (
    <div className={className} style={style} onMouseLeave={hideTooltip}>
      {children}
      <Chart
        {...rest}
        dailyData={dailyData}
        chartRef={chartDataRef}
        temperatureThreshold={temperatureThreshold}
        chartSettings={{
          plugins: {
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
            intersect: false,
            custom: customTooltip(chartDataRef),
          },
          legend: {
            display: true,
            rtl: true,
            labels: {
              fontSize: 14,
              fontColor: "#9ea6aa",
            },
          },
          // we could use mergeWith here too, but currently nothing would use it.
          ...chartSettings,
        }}
      />
      {showTooltip ? (
        <div
          className="chart-tooltip"
          id="chart-tooltip"
          style={{
            position: "fixed",
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          <Tooltip {...tooltipData} />
        </div>
      ) : null}
    </div>
  );
}

export default ChartWithTooltip;
