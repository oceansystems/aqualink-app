import React from "react";
import {
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import type { DailyData } from "../../../../store/Reefs/types";

import ChartWithTooltip from "../../../../common/Chart/ChartWithTooltip";

const Charts = ({ classes, temperatureThreshold, ...rest }: ChartsProps) => {
  return (
    <ChartWithTooltip
      {...rest}
      className={classes.root}
      temperatureThreshold={temperatureThreshold}
      chartSettings={{
        annotation: {
          annotations: [
            {
              type: "line",
              mode: "horizontal",
              scaleID: "y-axis-0",
              value: temperatureThreshold,
              borderColor: "#ff8d00",
              borderWidth: 2,
              borderDash: [5, 5],
              label: {
                backgroundColor: "rgb(169,169,169)",
                enabled: false,
                position: "left",
                xAdjust: 10,
                content: "Bleaching Threshold",
              },
            },
          ],
        },
      }}
    >
      <Typography className={classes.graphTitle} variant="h6">
        DAILY WATER TEMPERATURE (°C)
      </Typography>
    </ChartWithTooltip>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: "16rem",
    },
    graphTitle: {
      lineHeight: 1.5,
      marginLeft: "4rem",

      [theme.breakpoints.down("xs")]: {
        marginLeft: 0,
      },
    },
  });

interface ChartsIncomingProps {
  dailyData: DailyData[];
  temperatureThreshold: number | null;
  maxMonthlyMean: number | null;
  depth: number | null;
}

type ChartsProps = ChartsIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(Charts);
