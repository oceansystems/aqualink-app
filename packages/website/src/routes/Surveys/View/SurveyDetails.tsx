import React from "react";
import moment from "moment";
import {
  withStyles,
  WithStyles,
  createStyles,
  Grid,
  Typography,
} from "@material-ui/core";
import {
  getNumberOfImages,
  getNumberOfSurveyPoints,
} from "../../../helpers/surveyMedia";

import type { Reef } from "../../../store/Reefs/types";
import type { SurveyState } from "../../../store/Survey/types";
import { getReefNameAndRegion } from "../../../store/Reefs/helpers";
import ObservationBox from "./observationBox";

const SurveyDetails = ({ reef, survey, classes }: SurveyDetailsProps) => {
  const nSurveyPoints = getNumberOfSurveyPoints(survey?.surveyMedia || []);
  const nImages = getNumberOfImages(survey?.surveyMedia || []);
  const { region: regionName } = getReefNameAndRegion(reef);
  return (
    <Grid style={{ marginTop: "1rem" }} container item xs={12} direction="row">
      {survey && (
        <Grid container item direction="column" spacing={3} xs={12} lg={8}>
          <Grid item>
            <Typography variant="subtitle1">
              {moment(survey.diveDate).format("MM/DD/YYYY [at] h:mm A")}
            </Typography>
          </Grid>
          <Grid container item direction="row">
            <Grid container item direction="column" xs={12} md={4}>
              <Typography style={{ fontSize: 18 }}>{regionName}</Typography>
              <Typography variant="subtitle1">{reef.name}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography
                color="primary"
                variant="h4"
                className={classes.inlineText}
              >
                {nSurveyPoints}
              </Typography>
              <Typography
                color="initial"
                variant="h6"
                className={classes.inlineText}
              >
                SURVEY POINT{nSurveyPoints === 1 ? "" : "S"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography
                color="primary"
                variant="h4"
                className={classes.inlineText}
              >
                {nImages}
              </Typography>
              <Typography
                color="initial"
                variant="h6"
                className={classes.inlineText}
              >
                IMAGE{nImages === 1 ? "" : "S"}
              </Typography>
            </Grid>
          </Grid>
          {survey.comments && (
            <Grid container item direction="column">
              <Typography variant="h6">Comments</Typography>
              <Typography variant="subtitle1">{survey.comments}</Typography>
            </Grid>
          )}
        </Grid>
      )}

      <Grid item xs={12} md={6} lg={4}>
        <ObservationBox
          depth={reef.depth}
          date={survey?.diveDate ? new Date(survey?.diveDate) : new Date()}
          dailyData={reef.dailyData}
        />
      </Grid>
    </Grid>
  );
};

const styles = () =>
  createStyles({
    inlineText: {
      display: "inline",
      fontWeight: "normal",
      marginLeft: "0.5rem",
    },
  });

interface SurveyDetailsIncomingProps {
  reef: Reef;
  survey?: SurveyState | null;
}

SurveyDetails.defaultProps = {
  survey: null,
};

type SurveyDetailsProps = SurveyDetailsIncomingProps &
  WithStyles<typeof styles>;

export default withStyles(styles)(SurveyDetails);
