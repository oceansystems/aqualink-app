import React from "react";
import { withStyles, WithStyles, createStyles, Theme } from "@material-ui/core";

import { alertLevelColorCode } from "../../../assets/colorCode";

const AlertLevelLegend = ({ classes }: AlertLevelLegendProps) => {
  return (
    <div className={classes.root}>
      {alertLevelColorCode.map((item, index) => (
        <div
          key={item.value}
          style={{ backgroundColor: item.color }}
          className={
            index === alertLevelColorCode.length - 1
              ? `${classes.legendItem} ${classes.lastChild}`
              : `${classes.legendItem}`
          }
        >
          {item.value}
        </div>
      ))}
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      zIndex: 401,
      color: "white",
      position: "absolute",
      bottom: 40,
      right: 10,
      display: "flex",
      [theme.breakpoints.down("md")]: {
        left: 10,
      },
      [theme.breakpoints.down("xs")]: {
        bottom: 80,
      },
    },
    legendItem: {
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      minWidth: "4rem",
      marginRight: "0.5rem",
      [theme.breakpoints.down("xs")]: {
        fontWeight: 400,
        minWidth: "3rem",
      },
    },
    lastChild: {
      margin: 0,
    },
  });

type AlertLevelLegendProps = WithStyles<typeof styles>;

export default withStyles(styles)(AlertLevelLegend);
