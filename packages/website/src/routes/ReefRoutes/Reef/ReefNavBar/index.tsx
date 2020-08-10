import React from "react";
import {
  AppBar,
  Toolbar,
  Grid,
  Typography,
  IconButton,
  Avatar,
  withStyles,
  WithStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import ArrowBack from "@material-ui/icons/ArrowBack";

const ReefNavBar = ({
  reefName,
  lastSurvey,
  managerName,
  classes,
}: ReefNavBarProps) => (
  <AppBar className={classes.appBar} position="static">
    <Toolbar>
      <Grid item container justify="space-between" alignItems="center" xs={12}>
        <Grid item xs={5}>
          <Grid alignItems="center" direction="row" container spacing={1}>
            <Grid item>
              <Link style={{ color: "inherit" }} to="/reefs">
                <IconButton edge="start" color="inherit" aria-label="menu">
                  <ArrowBack />
                </IconButton>
              </Link>
            </Grid>
            {reefName && lastSurvey && (
              <Grid item xs={7} direction="column" container>
                <Grid item>
                  <Typography variant="h4">{reefName}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">{`Last surveyed: ${lastSurvey}`}</Typography>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={5}>
          {managerName && (
            <Grid container justify="flex-end" alignItems="center" spacing={2}>
              <Grid item>
                <Grid container direction="column" alignItems="flex-end">
                  <Typography variant="subtitle2">
                    {`Managed by: ${managerName}`}
                  </Typography>
                  <Typography variant="caption">Contact Manager</Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container>
                  <Avatar />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Toolbar>
  </AppBar>
);

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      "&.MuiPaper-root": {
        backgroundColor: theme.palette.primary.main,
      },
    },
  });

interface ReefNavBarIncomingProps {
  reefName?: string;
  lastSurvey?: string;
  managerName?: string;
}

type ReefNavBarProps = ReefNavBarIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(ReefNavBar);
