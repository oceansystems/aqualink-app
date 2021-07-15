import React, { FC, PropsWithChildren } from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  GridProps,
  Grid,
  Theme,
} from "@material-ui/core";
import classNames from "classnames";

import Title from "./Title";
import { Value } from "./types";

const CardWithTitle: FC<CardWithTitleProps> = ({
  classes,
  gridProps,
  titleItems,
  className,
  forcedAspectRatio,
  children,
}: PropsWithChildren<CardWithTitleProps>) => {
  return (
    <Grid className={className} container item {...gridProps}>
      {titleItems.length > 0 && (
        <Grid item xs={12}>
          <Title values={titleItems} />
        </Grid>
      )}
      <Grid
        item
        xs={12}
        className={classNames({
          [classes.forcedAspectRatioWrapper]: forcedAspectRatio,
        })}
      >
        <div
          className={
            forcedAspectRatio
              ? classes.absolutePositionedContainer
              : classes.container
          }
        >
          {children}
        </div>
      </Grid>
    </Grid>
  );
};

const styles = (theme: Theme) => {
  const aspectRatio = "16 / 9";

  return createStyles({
    forcedAspectRatioWrapper: {
      paddingTop: `calc((100% - ${theme.spacing(
        2
      )}px) / (${aspectRatio}) + ${theme.spacing(2)}px)`,
      marginTop: -theme.spacing(1),
      position: "relative",
    },
    container: {
      height: "30rem",
      [theme.breakpoints.only("md")]: {
        height: "25rem",
      },
      [theme.breakpoints.down("xs")]: {
        height: "20rem",
      },
    },
    absolutePositionedContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      padding: theme.spacing(1),
      width: "100%",
      height: "100%",
    },
  });
};

interface CardWithTitleIncomingProps {
  gridProps: GridProps;
  titleItems: Value[];
  className?: string;
  forcedAspectRatio?: boolean;
}

type CardWithTitleProps = CardWithTitleIncomingProps &
  WithStyles<typeof styles>;

export default withStyles(styles)(CardWithTitle);
