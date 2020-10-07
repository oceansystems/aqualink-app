import React from "react";
import { withStyles, WithStyles, createStyles } from "@material-ui/core";

const Legend = ({ unit, colorCode, classes }: LegendProps) => {
  const gradientColors = colorCode.map((item) => item.color).join(", ");

  return (
    <div className={classes.root}>
      {unit && (
        <div
          className={`${classes.unit} ${classes.codeItem} ${classes.text}`}
          style={{ backgroundColor: colorCode[0].color }}
        >
          {unit}
        </div>
      )}
      <div
        className={classes.legendWrapper}
        style={{ background: `linear-gradient(to right, ${gradientColors})` }}
      >
        {colorCode.map((item) => (
          <div
            key={item.color}
            className={`${classes.value} ${classes.codeItem} ${classes.text}`}
          >
            {item.value}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = () =>
  createStyles({
    root: {
      display: "flex",
    },
    legendWrapper: {
      display: "flex",
      borderRadius: "0 4px 4px 0",
    },
    codeItem: {
      height: 17,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    unit: {
      borderRadius: "4px 0 0 4px",
      width: "2rem",
    },
    value: {
      width: "1.3rem",
    },
    text: {
      fontSize: 9,
      color: "white",
    },
  });

interface ColorItem {
  color: string;
  value: number;
}

interface LegendIncomingProps {
  unit?: string | null;
  colorCode: ColorItem[];
}

Legend.defaultProps = {
  unit: null,
};

type LegendProps = LegendIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(Legend);
