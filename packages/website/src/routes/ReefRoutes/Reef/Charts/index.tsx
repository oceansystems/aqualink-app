import React from "react";
import {
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";

import ChartWithTooltip, {
  ChartWithTooltipProps,
} from "../../../../common/Chart/ChartWithTooltip";

const Charts = ({ classes, ...rest }: ChartsProps) => {
  return (
    <ChartWithTooltip {...rest} className={classes.root}>
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

type ChartsProps = ChartWithTooltipProps & WithStyles<typeof styles>;

export default withStyles(styles)(Charts);
