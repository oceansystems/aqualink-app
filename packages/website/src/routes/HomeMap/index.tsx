import { LatLng } from "leaflet";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  createStyles,
  Grid,
  Hidden,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import SwipeableBottomSheet from "react-swipeable-bottom-sheet";
import HomepageNavBar from "../../common/NavBar";
import HomepageMap from "./Map";
import ReefTable from "./ReefTable";
import {
  reefsRequest,
  reefsListSelector,
} from "../../store/Reefs/reefsListSlice";
import {
  reefDetailsSelector,
  reefRequest,
} from "../../store/Reefs/selectedReefSlice";
import { reefOnMapSelector } from "../../store/Homepage/homepageSlice";

import { surveysRequest } from "../../store/Survey/surveyListSlice";
import { findReefById, findInitialReefPosition } from "../../helpers/reefUtils";

enum QueryParamKeys {
  REEF_ID = "reef_id",
  ZOOM_LEVEL = "zoom",
}

interface MapQueryParams {
  initialCenter: LatLng;
  initialZoom: number;
  initialReefId: string | undefined;
}

const INITIAL_CENTER = new LatLng(0, 121.3);
const INITIAL_ZOOM = 5;

function useQuery() {
  const urlParams: URLSearchParams = new URLSearchParams(useLocation().search);
  const zoomLevelParam = urlParams.get(QueryParamKeys.ZOOM_LEVEL);
  const initialZoom: number = zoomLevelParam ? +zoomLevelParam : INITIAL_ZOOM;
  const queryParamReefId = urlParams.get(QueryParamKeys.REEF_ID) || "";
  const reefsList = useSelector(reefsListSelector) || [];
  const featuredReefId = process.env.REACT_APP_FEATURED_REEF_ID || "";
  const initialReefId = queryParamReefId
    ? findReefById(reefsList, queryParamReefId)?.id.toString() ||
      findReefById(reefsList, featuredReefId)?.id.toString() ||
      ""
    : featuredReefId;

  // Focus on the reef provided in the queryParamReefId or the reef with highest alert level.
  const initialCenter =
    findInitialReefPosition(
      reefsList,
      queryParamReefId === initialReefId ? initialReefId : undefined
    ) || INITIAL_CENTER;

  return {
    initialCenter,
    initialReefId,
    initialZoom,
  };
}

const Homepage = ({ classes }: HomepageProps) => {
  const dispatch = useDispatch();
  const reefOnMap = useSelector(reefOnMapSelector);
  const { id: reefOnCardId } = useSelector(reefDetailsSelector) || {};
  const reefs = useSelector(reefsListSelector);

  const {
    initialZoom,
    initialReefId,
    initialCenter,
  }: MapQueryParams = useQuery();

  useEffect(() => {
    if (!reefs) {
      dispatch(reefsRequest());
    }
  }, [dispatch, reefs]);

  useEffect(() => {
    if (!reefOnMap && initialReefId && `${reefOnCardId}` !== initialReefId) {
      dispatch(reefRequest(initialReefId));
      dispatch(surveysRequest(initialReefId));
    } else if (reefOnMap && reefOnCardId !== reefOnMap.id) {
      dispatch(reefRequest(`${reefOnMap.id}`));
      dispatch(surveysRequest(`${reefOnMap.id}`));
    }
  }, [dispatch, initialReefId, reefOnCardId, reefOnMap]);

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  // scroll drawer to top when its closed.
  // the lib we use doesn't support passing ID or ref, so we rely on class name here.
  // scrollTopAtClose prop doesn't work with manually controlled state
  useEffect(() => {
    if (isDrawerOpen) return;
    const className = "ReactSwipeableBottomSheet";
    const drawer =
      document.getElementsByClassName(`${className}--opened`)[0] ||
      document.getElementsByClassName(`${className}--closed`)[0];
    if (!drawer) return;
    // eslint-disable-next-line fp/no-mutation
    drawer.scrollTop = 0;
  });

  return (
    <>
      <div role="presentation" onClick={isDrawerOpen ? toggleDrawer : () => {}}>
        <HomepageNavBar searchLocation geocodingEnabled />
      </div>
      <div className={classes.root}>
        <Grid container>
          <Grid className={classes.map} item xs={12} sm={6}>
            <HomepageMap
              initialZoom={initialZoom}
              initialCenter={initialCenter}
            />
          </Grid>
          <Hidden xsDown>
            <Grid className={classes.reefTable} item sm={6}>
              <ReefTable />
            </Grid>
          </Hidden>
          <Hidden smUp>
            <SwipeableBottomSheet
              overflowHeight={60}
              bodyStyle={{
                borderTopLeftRadius: "25px",
                borderTopRightRadius: "25px",
                maxHeight: "80vh",
              }}
              onChange={setDrawerOpen}
              open={isDrawerOpen}
            >
              <div role="presentation" onClick={toggleDrawer}>
                <ReefTable isDrawerOpen={isDrawerOpen} />
              </div>
            </SwipeableBottomSheet>
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
      zIndex: 0,
    },
    reefTable: {
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 64px);", // subtract height of the navbar
      overflowY: "auto",
    },
  });

type HomepageProps = WithStyles<typeof styles>;

export default withStyles(styles)(Homepage);
