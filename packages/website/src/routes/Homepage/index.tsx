import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Grid, withStyles, WithStyles, createStyles } from "@material-ui/core";

import HomepageNavBar from "../../common/NavBar";
import HomepageMap from "./Map";
import ReefTable from "./ReefTable";
import { reefsRequest } from "../../store/Reefs/reefsListSlice";
import { reefRequest } from "../../store/Reefs/selectedReefSlice";

const featuredReefId = "1";

const Homepage = ({ classes }: HomepageProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reefsRequest());
    dispatch(reefRequest(featuredReefId));
  }, [dispatch]);

  return (
    <>
      <HomepageNavBar searchLocation />
      <div className={classes.root}>
        <Grid
          style={{ height: "100%" }}
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Grid className={classes.map} item xs={6}>
            <HomepageMap />
          </Grid>
          <Grid className={classes.reefTable} item xs={6}>
            <ReefTable />
          </Grid>
        </Grid>
      </div>
    </>
  );
};

const styles = () =>
  createStyles({
    root: {
      height: "100%",
    },
    map: {
      height: "100%",
    },
    reefTable: {
      height: "calc(100vh - 64px)",
      overflowY: "auto",
    },
  });

type HomepageProps = WithStyles<typeof styles>;

export default withStyles(styles)(Homepage);
