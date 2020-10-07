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
import { formatNumber } from "../../../helpers/numberUtils";

const Tooltip = ({
  date,
  depth,
  bottomTemperature,
  surfaceTemperature,
  classes,
}: TooltipProps) => {
  // Remove seconds from date
  const dateString = new Date(date).toLocaleString("en", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <div className={classes.tooltip}>
      <Card className={classes.tooltipCard}>
        <CardHeader
          className={classes.tooltipHeader}
          title={
            <Typography color="textPrimary" variant="caption">
              {dateString}
            </Typography>
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
              {bottomTemperature && (
                <Grid item xs={6} className={classes.tooltipContentItem}>
                  <Grid container justify="flex-start" item xs={12}>
                    <Typography variant="caption">{`TEMP AT ${depth}m`}</Typography>
                  </Grid>
                  <Grid container justify="flex-start" item xs={12}>
                    <Typography variant="h5">
                      {`${formatNumber(bottomTemperature, 1)} °C`}
                    </Typography>
                  </Grid>
                </Grid>
              )}
              <Grid
                item
                xs={bottomTemperature ? 6 : 12}
                className={classes.tooltipContentItem}
              >
                <Grid container justify="flex-start" item xs={12}>
                  <Typography variant="caption">SURFACE TEMP</Typography>
                </Grid>
                <Grid container justify="flex-start" item xs={12}>
                  <Typography variant="h5">
                    {`${formatNumber(surfaceTemperature, 1)} °C`}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <div
        className={classes.tooltipArrow}
        style={{
          borderColor: "#095877 transparent transparent transparent",
        }}
      />
    </div>
  );
};

const styles = () =>
  createStyles({
    tooltip: {
      display: "flex",
      justifyContent: "center",
      height: 100,
      width: 200,
    },
    tooltipCard: {
      display: "flex",
      flexFlow: "column",
      backgroundColor: "#095877",
      borderRadius: 8,
    },
    tooltipHeader: {
      flex: "0 1 auto",
      padding: "0.5rem 1rem 0 1rem",
    },
    tooltipContent: {
      flex: "1 1 auto",
      padding: "0rem 1rem 0.5rem 1rem",
    },
    tooltipContentItem: {
      width: "100px",
      margin: "0",
    },
    tooltipArrow: {
      content: " ",
      position: "absolute",
      top: "100%" /* At the bottom of the tooltip */,
      left: "50%",
      marginLeft: "-10px",
      borderWidth: "10px",
      borderStyle: "solid",
      borderColor: "#095877 transparent transparent transparent",
    },
  });

export interface TooltipData {
  date: string;
  depth: number | null;
  bottomTemperature: number | null;
  surfaceTemperature: number;
}

type TooltipProps = TooltipData & WithStyles<typeof styles>;

export default withStyles(styles)(Tooltip);
