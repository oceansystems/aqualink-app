import React, { useEffect } from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Grid,
  Typography,
  LinearProgress,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import ReefNavBar from "./ReefNavBar";
import ReefFooter from "./Footer";
import {
  reefDetailsSelector,
  reefLoadingSelector,
  reefErrorSelector,
  reefRequest,
} from "../../../store/Reefs/selectedReefSlice";
import ReefDetails from "./ReefDetails";

const Reef = ({ match, classes }: ReefProps) => {
  const reefDetails = useSelector(reefDetailsSelector);
  const loading = useSelector(reefLoadingSelector);
  const error = useSelector(reefErrorSelector);
  const dispatch = useDispatch();
  const reefId = match.params.id;

  useEffect(() => {
    dispatch(reefRequest(reefId));
  }, [dispatch, reefId]);

  return (
    <>
      <ReefNavBar
        reefName={reefDetails?.name || ""}
        lastSurvey="May 10, 2020"
        managerName={reefDetails?.admin || ""}
      />
      {/* eslint-disable-next-line no-nested-ternary */}
      {loading ? (
        <LinearProgress />
      ) : reefDetails && reefDetails.dailyData.length > 0 && !error ? (
        <>
          <ReefDetails reef={reefDetails} />
          <ReefFooter />
        </>
      ) : (
        <div className={classes.noData}>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item>
              <Typography gutterBottom color="primary" variant="h2">
                No Data Found
              </Typography>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
};

const styles = () =>
  createStyles({
    noData: {
      display: "flex",
      alignItems: "center",
      height: "100%",
    },
  });

interface MatchProps extends RouteComponentProps<{ id: string }> {}

type ReefProps = WithStyles<typeof styles> & MatchProps;

export default withStyles(styles)(Reef);
