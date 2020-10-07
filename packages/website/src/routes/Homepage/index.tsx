import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Grid,
  withStyles,
  WithStyles,
  createStyles,
  Hidden,
  Drawer,
} from "@material-ui/core";
import classNames from "classnames";

import HomepageNavBar from "../../common/NavBar";
import HomepageMap from "./Map";
import ReefTable from "./ReefTable";
import { reefsRequest } from "../../store/Reefs/reefsListSlice";

const Homepage = ({ classes }: HomepageProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reefsRequest());
  }, [dispatch]);

  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <>
      <div role="presentation" onClick={openDrawer ? toggleDrawer : () => {}}>
        <HomepageNavBar searchLocation />
      </div>
      <div className={classes.root}>
        <Grid container direction="row">
          <Grid className={classes.map} item xs={12} sm={6}>
            <HomepageMap />
          </Grid>
          <Hidden xsDown>
            <Grid className={classes.reefTable} item sm={6}>
              <ReefTable openDrawer={openDrawer} />
            </Grid>
          </Hidden>
          <Hidden smUp>
            <Drawer
              variant="permanent"
              anchor="bottom"
              open={openDrawer}
              onClose={toggleDrawer}
              className={classNames({
                [classes.openDrawer]: openDrawer,
                [classes.closedDrawer]: !openDrawer,
              })}
              classes={{
                paper: classNames(classes.drawer, {
                  [classes.openDrawer]: openDrawer,
                  [classes.closedDrawer]: !openDrawer,
                }),
              }}
            >
              <div role="presentation" onClick={toggleDrawer}>
                <ReefTable openDrawer={openDrawer} />
              </div>
            </Drawer>
          </Hidden>
        </Grid>
      </div>
    </>
  );
};

const styles = () =>
  createStyles({
    root: {
      display: "flex",
      flexGrow: 1,
    },
    map: {
      display: "flex",
    },
    reefTable: {
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 64px);", // subtract height of the navbar
    },
    drawer: {
      borderTopLeftRadius: "15px",
      borderTopRightRadius: "15px",
    },
    openDrawer: {
      height: "calc(95% - 64px);", // subtract height of the navbar
    },
    closedDrawer: {
      height: "50px",
      overflow: "revert",
    },
  });

type HomepageProps = WithStyles<typeof styles>;

export default withStyles(styles)(Homepage);
