import React from "react";
import { withStyles, WithStyles, createStyles, Theme } from "@material-ui/core";

import CustomLegend from "../../../../common/Legend";
import {
  dhwColorCode,
  surfaceTempColorCode,
} from "../../../../assets/colorCode";

const legends = [
  {
    name: "Sea Surface Temperature",
    element: <CustomLegend unit="°C" colorCode={surfaceTempColorCode} />,
  },
  {
    name: "Heat Stress",
    element: <CustomLegend unit="DHW" colorCode={dhwColorCode} />,
  },
];

const Legend = ({ legendName, classes }: LegendProps) => {
  const legend = legends.find((item) => item.name === legendName);
  return <div className={classes.root}>{legend?.element}</div>;
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      zIndex: 401,
      position: "absolute",
      bottom: 40,
      left: 10,
      [theme.breakpoints.down("md")]: {
        bottom: 80,
      },
      [theme.breakpoints.down("xs")]: {
        bottom: 110,
      },
    },
  });

interface LegendIncomingProps {
  legendName: string;
}

type LegendProps = LegendIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(Legend);
