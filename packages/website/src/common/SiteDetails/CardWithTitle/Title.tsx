import React from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Box,
  Grid,
  Typography,
  Theme,
} from "@material-ui/core";
import classNames from "classnames";

import { Value } from "./types";

const Title = ({ classes, values }: TitleProps) => {
  return (
    <Box className={classes.root}>
      <Grid container alignItems="baseline">
        {values.map((item) => (
          <Grid
            className={classNames({
              [classes.maxWidth]: item.overflowEllipsis,
            })}
            style={{ marginRight: item.marginRight }}
            key={item.text}
            title={item.overflowEllipsis ? item.text : undefined}
            item
          >
            <Typography
              className={classNames({
                [classes.overflowEllipsis]: item.overflowEllipsis,
              })}
              variant={item.variant}
            >
              {item.text}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: "0 0 0.2rem 1rem",
      [theme.breakpoints.down("xs")]: {
        margin: "0 0 0.2rem 0.2rem",
      },
    },
    maxWidth: {
      maxWidth: "45%",
      [theme.breakpoints.down("xs")]: {
        maxWidth: "40%",
      },
    },
    overflowEllipsis: {
      width: "100%",
      display: "block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  });

interface TitleIncomingProps {
  values: Value[];
}

type TitleProps = TitleIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(Title);
