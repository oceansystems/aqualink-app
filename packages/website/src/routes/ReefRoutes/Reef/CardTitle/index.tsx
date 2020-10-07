import React from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  TypographyTypeMap,
  Box,
  Grid,
  Typography,
} from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

const CardTitle = ({ classes, values }: CardTitleProps) => {
  return (
    <Box className={classes.root}>
      <Grid container alignItems="baseline">
        {values.map((item) => (
          <Grid style={{ marginRight: item.marginRight }} key={item.text} item>
            <Typography variant={item.variant}>{item.text}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const styles = () =>
  createStyles({
    root: {
      margin: "0 0 0.2rem 0.5rem",
    },
  });

export interface Value {
  text: string;
  variant: TypographyTypeMap["props"]["variant"];
  marginRight: CSSProperties["marginRight"];
}

interface CardTitleIncomingProps {
  values: Value[];
}

type CardTitleProps = CardTitleIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(CardTitle);
