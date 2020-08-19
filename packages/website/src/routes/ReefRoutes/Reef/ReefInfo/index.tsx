import React from "react";
import {
  Grid,
  Typography,
  IconButton,
  Avatar,
  withStyles,
  WithStyles,
  createStyles,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import ArrowBack from "@material-ui/icons/ArrowBack";

const ReefNavBar = ({
  reefName,
  lastSurvey,
  managerName,
  classes,
}: ReefNavBarProps) => {
  const history = useHistory();

  return (
    <Grid
      className={classes.root}
      item
      container
      justify="space-around"
      alignItems="center"
      xs={12}
    >
      <Grid item xs={5}>
        <Grid alignItems="center" direction="row" container spacing={1}>
          <Grid item>
            <IconButton
              edge="start"
              onClick={history.goBack}
              color="primary"
              aria-label="menu"
            >
              <ArrowBack />
            </IconButton>
          </Grid>
          {reefName && lastSurvey && (
            <Grid item xs={7} direction="column" container>
              <Grid item>
                <Typography variant="h4">{reefName}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">05/12/20 8:16AM PST</Typography>
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
  lastSurvey?: string;
  managerName?: string;
}

type ReefNavBarProps = ReefNavBarIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(ReefNavBar);
