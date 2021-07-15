import React from "react";
import { useSelector } from "react-redux";
import {
  withStyles,
  WithStyles,
  createStyles,
  Typography,
  Theme,
  Hidden,
  Grid,
} from "@material-ui/core";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineContent,
  TimelineOppositeContent,
} from "@material-ui/lab";

import SurveyCard from "../SurveyCard";
import { surveyListSelector } from "../../../../store/Survey/surveyListSlice";
import incomingStyles from "../styles";
import { filterSurveys } from "../../../../helpers/surveys";
import { SurveyMedia } from "../../../../store/Survey/types";
import { displayTimeInLocalTimezone } from "../../../../helpers/dates";
import AddButton from "../AddButton";

const SurveyTimeline = ({
  isAdmin,
  reefId,
  addNewButton,
  timeZone,
  observation,
  pointName,
  pointId,
  classes,
}: SurveyTimelineProps) => {
  const surveyList = useSelector(surveyListSelector);

  return (
    <div className={classes.root}>
      <Hidden mdDown>
        <Timeline>
          {isAdmin &&
            addNewButton &&
            !(window && window.location.pathname.includes("new_survey")) && (
              <TimelineItem className={classes.timelineItem}>
                <TimelineOppositeContent
                  className={classes.timelineOppositeContent}
                  // Modify padding to center the Add survey symbol.
                  style={{ padding: "0 10px" }}
                />
                <TimelineContent className={classes.addNewButtonWrapper}>
                  <AddButton reefId={reefId} />
                </TimelineContent>
              </TimelineItem>
            )}
          {surveyList &&
            filterSurveys(surveyList, observation, pointId).map((survey) => (
              <TimelineItem key={survey.id} className={classes.timelineItem}>
                {survey.diveDate && (
                  <TimelineOppositeContent
                    className={classes.timelineOppositeContent}
                  >
                    <Typography variant="h6" className={classes.dates}>
                      {displayTimeInLocalTimezone({
                        isoDate: survey.diveDate,
                        format: "MM/DD/YYYY",
                        displayTimezone: false,
                        timeZone,
                      })}
                    </Typography>
                  </TimelineOppositeContent>
                )}
                <TimelineSeparator>
                  <hr className={classes.connector} />
                  <TimelineDot variant="outlined" className={classes.dot} />
                  <hr className={classes.connector} />
                </TimelineSeparator>
                <TimelineContent className={classes.surveyCardWrapper}>
                  <SurveyCard
                    pointId={pointId}
                    pointName={pointName}
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
        <Grid container item xs={12}>
          {isAdmin &&
            addNewButton &&
            !(window && window.location.pathname.includes("new_survey")) && (
              <Grid
                style={{ marginBottom: "1rem" }}
                container
                alignItems="center"
                item
                xs={12}
              >
                <AddButton reefId={reefId} />
              </Grid>
            )}
          {surveyList &&
            filterSurveys(surveyList, observation, pointId).map((survey) => (
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
                    {displayTimeInLocalTimezone({
                      isoDate: survey.diveDate,
                      format: "MM/DD/YYYY",
                      displayTimezone: false,
                      timeZone,
                    })}
                  </Typography>
                </Grid>
                <Grid
                  className={classes.surveyCardWrapper}
                  container
                  item
                  xs={12}
                >
                  <SurveyCard
                    pointId={pointId}
                    pointName={pointName}
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
      height: 180,
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
    addNewButtonWrapper: {
      marginRight: theme.spacing(10),
    },
  });

interface SurveyTimelineIncomingProps {
  reefId: number;
  addNewButton: boolean;
  timeZone?: string | null;
  isAdmin: boolean;
  observation: SurveyMedia["observations"] | "any";
  pointName: string | null;
  pointId: number;
}

SurveyTimeline.defaultProps = {
  timeZone: null,
};

type SurveyTimelineProps = SurveyTimelineIncomingProps &
  WithStyles<typeof styles>;

export default withStyles(styles)(SurveyTimeline);
