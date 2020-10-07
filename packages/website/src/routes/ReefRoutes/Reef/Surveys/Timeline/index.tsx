import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  withStyles,
  WithStyles,
  createStyles,
  Typography,
  Theme,
  IconButton,
  Hidden,
  Grid,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineContent,
  TimelineOppositeContent,
} from "@material-ui/lab";
import { Link } from "react-router-dom";

import SurveyCard from "../SurveyCard";
import {
  surveyListSelector,
  surveysRequest,
} from "../../../../../store/Survey/surveyListSlice";
import incomingStyles from "../styles";
import filterSurveys from "../helpers";
import { SurveyMedia } from "../../../../../store/Survey/types";

const SurveyTimeline = ({
  isAdmin,
  reefId,
  observation,
  point,
  classes,
}: SurveyTimelineProps) => {
  const dispatch = useDispatch();
  const surveyList = useSelector(surveyListSelector);

  useEffect(() => {
    dispatch(surveysRequest(`${reefId}`));
  }, [dispatch, reefId]);

  return (
    <div className={classes.root}>
      <Hidden mdDown>
        <Timeline>
          {isAdmin &&
            !(window && window.location.pathname.includes("new_survey")) && (
              <TimelineItem className={classes.timelineItem}>
                <TimelineOppositeContent
                  className={classes.timelineOppositeContent}
                  // Modify padding to center the Add survey symbol.
                  style={{ padding: "0 10px" }}
                />
                <TimelineSeparator>
                  <Link
                    style={{ color: "inherit", textDecoration: "none" }}
                    to={`/reefs/${reefId}/new_survey`}
                  >
                    <IconButton>
                      <AddCircleOutlineIcon className={classes.addNewButton} />
                    </IconButton>
                  </Link>
                </TimelineSeparator>
                <TimelineContent style={{ padding: "12px 16px" }}>
                  <Typography className={classes.cardFields} variant="h6">
                    ADD NEW SURVEY
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            )}
          {surveyList &&
            filterSurveys(surveyList, observation, point).map((survey) => (
              <TimelineItem key={survey.id} className={classes.timelineItem}>
                {survey.diveDate && (
                  <TimelineOppositeContent
                    className={classes.timelineOppositeContent}
                  >
                    <Typography variant="h6" className={classes.dates}>
                      {moment(survey.diveDate).format("MM/DD/YYYY")}
                    </Typography>
                  </TimelineOppositeContent>
                )}
                <TimelineSeparator>
                  <hr className={classes.connector} />
                  <TimelineDot variant="outlined" className={classes.dot} />
                  <hr className={classes.connector} />
                </TimelineSeparator>
                <TimelineContent>
                  <SurveyCard
                    isAdmin={isAdmin}
                    reefId={reefId}
                    survey={survey}
                  />
                </TimelineContent>
              </TimelineItem>
            ))}
        </Timeline>
      </Hidden>
      <Hidden lgUp>
        <Grid container justify="flex-start" item xs={12}>
          {isAdmin &&
            !(window && window.location.pathname.includes("new_survey")) && (
              <Grid
                style={{ marginBottom: "1rem" }}
                container
                alignItems="center"
                justify="flex-start"
                item
                xs={12}
              >
                <Link
                  style={{ color: "inherit", textDecoration: "none" }}
                  to={`/reefs/${reefId}/new_survey`}
                >
                  <IconButton>
                    <AddCircleOutlineIcon className={classes.addNewButton} />
                  </IconButton>
                </Link>
                <Typography className={classes.cardFields} variant="h6">
                  ADD NEW SURVEY
                </Typography>
              </Grid>
            )}
          {surveyList &&
            filterSurveys(surveyList, observation, point).map((survey) => (
              <Grid
                key={survey.id}
                className={classes.surveyWrapper}
                container
                justify="center"
                item
                xs={12}
              >
                <Grid className={classes.dateWrapper} item xs={11}>
                  <Typography variant="h6" className={classes.dates}>
                    {moment.parseZone(survey.diveDate).format("MM/DD/YYYY")}
                  </Typography>
                </Grid>
                <Grid
                  className={classes.surveyCardWrapper}
                  container
                  item
                  xs={12}
                >
                  <SurveyCard
                    isAdmin={isAdmin}
                    reefId={reefId}
                    survey={survey}
                  />
                </Grid>
              </Grid>
            ))}
        </Grid>
      </Hidden>
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    ...incomingStyles,
    root: {
      marginTop: "3rem",
      width: "100%",
    },
    connector: {
      height: "9rem",
      borderLeft: "2px dashed #8f8f8f",
      marginTop: 0,
      marginBottom: 0,
    },
    timelineItem: {
      alignItems: "center",
    },
    timelineOppositeContent: {
      flex: 0.5,
    },
    dot: {
      border: "solid 1px #979797",
      backgroundColor: theme.palette.primary.light,
      height: "1rem",
      width: "1rem",
      padding: 0,
      margin: 0,
    },
    surveyWrapper: {
      marginTop: "2rem",
    },
  });

interface SurveyTimelineIncomingProps {
  reefId: number;
  isAdmin: boolean;
  observation: SurveyMedia["observations"] | "any";
  point: number;
}

type SurveyTimelineProps = SurveyTimelineIncomingProps &
  WithStyles<typeof styles>;

export default withStyles(styles)(SurveyTimeline);
