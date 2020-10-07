import React, { useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import ArrowBack from "@material-ui/icons/ArrowBack";
import {
  withStyles,
  WithStyles,
  createStyles,
  Container,
  Grid,
  IconButton,
  Theme,
  Paper,
  Typography,
  Box,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

import {
  surveyDetailsSelector,
  surveyGetRequest,
} from "../../../store/Survey/surveySlice";
import SurveyDetails from "./SurveyDetails";
import SurveyMediaDetails from "./SurveyMediaDetails";

import Charts from "./Charts";
import type { Reef } from "../../../store/Reefs/types";

const SurveyViewPage = ({ reef, surveyId, classes }: SurveyViewPageProps) => {
  const dispatch = useDispatch();
  const surveyDetails = useSelector(surveyDetailsSelector);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    dispatch(
      surveyGetRequest({
        reefId: `${reef.id}`,
        surveyId,
      })
    );
  }, [dispatch, reef.id, surveyId]);

  return (
    <Container>
      <Grid
        style={{ position: "relative" }}
        container
        justify="center"
        item
        xs={12}
      >
        <Box
          bgcolor="#f5f6f6"
          position="absolute"
          height="100%"
          width="100vw"
          zIndex="-1"
        />
        <Grid
          style={{ margin: "4rem 0 1rem 0" }}
          container
          alignItems="center"
          item
          xs={11}
        >
          <Link
            style={{ color: "inherit", textDecoration: "none" }}
            to={`/reefs/${reef.id}`}
          >
            <IconButton edge="start" color="primary" aria-label="menu">
              <ArrowBack />
            </IconButton>
          </Link>
          <Typography color="primary" variant="h5">
            Back to site
          </Typography>
        </Grid>
        <Grid style={{ marginBottom: "6rem" }} item xs={11}>
          <Paper elevation={3} className={classes.surveyDetailsCard}>
            <Grid
              style={{ height: "100%" }}
              container
              justify="space-between"
              item
              xs={12}
            >
              <Grid container justify="center" item md={12}>
                <Grid container item xs={11}>
                  <SurveyDetails reef={reef} survey={surveyDetails} />
                </Grid>
                <Grid container alignItems="center" item xs={11}>
                  <Typography variant="subtitle2">
                    DAILY WATER TEMPERATURE (°C)
                  </Typography>
                </Grid>
                <Grid container justify="center" item xs={12}>
                  <Charts
                    dailyData={reef.dailyData}
                    depth={reef.depth}
                    temperatureThreshold={(reef.maxMonthlyMean || 20) + 1}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Grid container justify="center" item xs={12}>
        <Grid container item xs={11}>
          <Grid style={{ margin: "5rem 0 5rem 0" }} item>
            <Typography style={{ fontSize: 18 }}>
              {`${moment(surveyDetails?.diveDate).format(
                "MM/DD/YYYY"
              )} Survey Media`}
            </Typography>
          </Grid>
          <Grid style={{ width: "100%" }} item>
            <SurveyMediaDetails
              reefId={reef.id}
              surveyId={surveyId}
              surveyMedia={surveyDetails?.surveyMedia}
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    surveyDetailsCard: {
      width: "100%",
      height: "35rem",
      color: theme.palette.text.secondary,
      [theme.breakpoints.down("md")]: {
        height: "40rem",
      },
      [theme.breakpoints.down("sm")]: {
        height: "70rem",
      },
    },
  });

interface SurveyViewPageIncomingProps {
  reef: Reef;
  surveyId: string;
}

type SurveyViewPageProps = SurveyViewPageIncomingProps &
  WithStyles<typeof styles>;

export default withStyles(styles)(SurveyViewPage);
