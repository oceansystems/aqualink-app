import React from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";
import { formatNumber } from "../../../../../helpers/numberUtils";

const Tooltip = ({
  date,
  depth,
  bottomTemperature,
  surfaceTemperature,
  classes,
}: TooltipProps) => {
  // Remove seconds from date
  const dateWithoutSeconds = new Date(date)
    .toLocaleString()
    .replace(/:\d{2}\s/, " ");
  const splitDate = dateWithoutSeconds.split(", ");

  return (
    <Card className={classes.tooltip}>
      <CardHeader
        className={classes.tooltipHeader}
        title={
          <Grid
            alignItems="center"
            justify="space-between"
            item
            container
            xs={12}
          >
            <Grid item>
              <Typography color="textPrimary" variant="caption">
                {splitDate[0]}
              </Typography>
            </Grid>
            <Grid item>
              <Typography color="textPrimary" variant="caption">
                {splitDate[1]}
              </Typography>
            </Grid>
          </Grid>
        }
      />
      <CardContent className={classes.tooltipContent}>
        <Grid
          style={{ height: "100%" }}
          item
          container
          direction="row"
          justify="space-between"
        >
          <Grid
            container
            justify="space-between"
            alignItems="center"
            item
            xs={12}
          >
            <Grid item xs={6}>
              <Grid container justify="flex-start" item xs={12}>
                <Typography variant="caption">{`TEMP AT ${depth}M`}</Typography>
              </Grid>
              <Grid container justify="flex-start" item xs={12}>
                <Typography variant="h5">
                  {bottomTemperature
                    ? `${formatNumber(bottomTemperature, 1)} \u2103`
                    : "- -"}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container justify="flex-end" item xs={12}>
                <Typography variant="caption">SURFACE TEMP</Typography>
              </Grid>
              <Grid container justify="flex-end" item xs={12}>
                <Typography variant="h5">
                  {surfaceTemperature
                    ? `${formatNumber(surfaceTemperature, 1)} \u2103`
                    : "-"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const styles = () =>
  createStyles({
    tooltip: {
      height: 100,
      width: 200,
      display: "flex",
      flexFlow: "column",
      backgroundColor: "#404b6b",
      opacity: 0.9,
    },
    tooltipHeader: {
      flex: "0 1 auto",
      padding: "0.5rem 1rem 0 1rem",
    },
    tooltipContent: {
      flex: "1 1 auto",
      padding: "0.5rem 1rem 0.5rem 1rem",
    },
    tooltipContentRow: {
      display: "flex",
      alignItems: "baseline",
    },
  });

export interface TooltipData {
  date: string;
  depth: number | null;
  bottomTemperature: number;
  surfaceTemperature: number;
}

type TooltipProps = TooltipData & WithStyles<typeof styles>;

export default withStyles(styles)(Tooltip);
