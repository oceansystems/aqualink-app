import React from "react";
import {
  AppBar,
  Toolbar,
  Grid,
  Typography,
  withStyles,
  WithStyles,
  createStyles,
  Theme,
} from "@material-ui/core";

const Footer = ({ classes }: FooterProps) => {
  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar>
        <Grid container justify="center">
          <Grid item xs={10} container direction="row">
            <Typography variant="h4">Aqua</Typography>
            <Typography style={{ color: "#8AC6DE" }} variant="h4">
              link
            </Typography>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      marginTop: "2rem",
      "&.MuiPaper-root": {
        backgroundColor: theme.palette.primary.main,
      },
    },
  });

type FooterProps = WithStyles<typeof styles>;

export default withStyles(styles)(Footer);
