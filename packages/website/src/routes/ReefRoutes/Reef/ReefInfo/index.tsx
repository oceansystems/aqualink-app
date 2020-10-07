import React from "react";
import moment from "moment";
import {
  Grid,
  Typography,
  IconButton,
  Avatar,
  withStyles,
  WithStyles,
  createStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import ArrowBack from "@material-ui/icons/ArrowBack";

const ReefNavBar = ({
  reefName = "",
  lastSurvey,
  managerName,
  classes,
}: ReefNavBarProps) => {
  return (
    <Grid
      className={classes.root}
      container
      justify="space-between"
      alignItems="center"
    >
      <Grid item xs={11}>
        <Grid alignItems="center" direction="row" container spacing={1}>
          <Grid item>
            <Link style={{ color: "inherit", textDecoration: "none" }} to="/">
              <IconButton edge="start" color="primary" aria-label="menu">
                <ArrowBack />
              </IconButton>
            </Link>
          </Grid>

          <Grid item xs={9} direction="column" container>
            {reefName && (
              <Grid item>
                <Typography variant="h4">{reefName}</Typography>
              </Grid>
            )}
            {lastSurvey && (
              <Grid item>
                <Typography variant="subtitle1">{`Last surveyed: ${moment(
                  lastSurvey
                ).format("MMM DD[,] YYYY")}`}</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={5}>
        {managerName && (
          <Grid container justify="flex-end" alignItems="center">
            <Grid className={classes.managerInfo} item>
              <Grid container direction="column" alignItems="flex-end">
                <Typography variant="subtitle1">
                  {`Managed by: ${managerName}`}
                </Typography>
                <Link
                  style={{ color: "inherit", textDecoration: "none" }}
                  to="/"
                >
                  <Typography color="primary" variant="subtitle2">
                    Contact Manager
                  </Typography>
                </Link>
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
  );
};

const styles = () =>
  createStyles({
    root: {
      marginTop: "2rem",
    },
    managerInfo: {
      marginRight: "0.5rem",
    },
  });

interface ReefNavBarIncomingProps {
  reefName?: string;
  lastSurvey?: string | null;
  managerName?: string;
}

ReefNavBar.defaultProps = {
  reefName: "",
  lastSurvey: null,
  managerName: "",
};

type ReefNavBarProps = ReefNavBarIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(ReefNavBar);
