import React, { useEffect, useState } from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  LinearProgress,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, useLocation } from "react-router-dom";

import NavBar from "../../common/NavBar";
import Footer from "../../common/Footer";
import {
  userInfoSelector,
  userLoadingSelector,
} from "../../store/User/userSlice";
import { collectionRequest } from "../../store/Collection/collectionSlice";
import Delayed from "../../common/Delayed";
import DashboardContent from "./Content";
import FullScreenMessage from "../../common/FullScreenMessage";

// This will be removed when the idea of public collections will be introduced.
// For now only this static one is being used.
const collections: Record<string, number> = {
  minderoo: 1,
};

const Dashboard = ({ match, classes }: DashboardProps) => {
  const dispatch = useDispatch();
  const user = useSelector(userInfoSelector);
  const userLoading = useSelector(userLoadingSelector);
  const [publicNotFound, setPublicNotFound] = useState(false);
  const { pathname } = useLocation();
  const atDashboard = pathname.endsWith("/dashboard");

  // If we are at `/dashboard`, make a request for
  // user's personal collection.
  useEffect(() => {
    if (atDashboard && user?.token && user.collection?.id) {
      dispatch(
        collectionRequest({
          id: user.collection.id,
          token: user.token,
        })
      );
    }
  }, [atDashboard, dispatch, user]);

  // If we are at `/collections/:collectionName`, look for this
  // collection in the static public collections object. If it exists,
  // make a request for this public collection, otherwise inform
  // the user that this public collection does not exist.
  useEffect(() => {
    if (!atDashboard) {
      const { collectionName: urlCollectionName } = match.params;
      const isHeatStress = urlCollectionName === "heat-stress";
      const urlCollectionId = urlCollectionName
        ? collections[urlCollectionName]
        : undefined;

      if (urlCollectionId || isHeatStress) {
        setPublicNotFound(false);
        dispatch(
          collectionRequest({
            id: urlCollectionId,
            isPublic: true,
            isHeatStress,
          })
        );
      } else {
        setPublicNotFound(true);
      }
    }
  }, [atDashboard, dispatch, match.params]);

  const DashboardComponent = () => {
    switch (true) {
      case atDashboard && userLoading:
        return <LinearProgress />;
      case atDashboard && !user && !userLoading:
        return (
          <Delayed waitBeforeShow={1000}>
            <FullScreenMessage message="Please sign in to view your dashboard" />
          </Delayed>
        );
      case !atDashboard && publicNotFound:
        return <FullScreenMessage message="Collection not found" />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <>
      <NavBar searchLocation={false} />
      <div className={classes.root}>{DashboardComponent()}</div>
      <Footer />
    </>
  );
};

const styles = () =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  });

interface MatchProps extends RouteComponentProps<{ collectionName?: string }> {}

type DashboardProps = MatchProps & WithStyles<typeof styles>;

export default withStyles(styles)(Dashboard);
