import React from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme,
  Paper,
  Grid,
  CardMedia,
  Typography,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import { formatNumber } from "../../../../../helpers/numberUtils";
import DeleteButton from "../DeleteButton";
import { SurveyListItem } from "../../../../../store/Survey/types";
import incomingStyles from "../styles";
import ImageModal from "../../../../../common/ImageModal";

const SurveyCard = ({ isAdmin, reefId, survey, classes }: SurveyCardProps) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Paper elevation={0} className={classes.surveyCard}>
      <Grid style={{ height: "100%" }} container justify="space-between">
        <Grid className={classes.cardImageWrapper} item xs={12} md={5}>
          {survey.featuredSurveyMedia && (
            <CardMedia
              className={classes.cardImage}
              image={
                survey.featuredSurveyMedia.thumbnailUrl ||
                survey.featuredSurveyMedia.imageUrl
              }
              onClick={handleOpen}
              style={
                survey.featuredSurveyMedia.thumbnailUrl
                  ? { cursor: "pointer" }
                  : {}
              }
            />
          )}
          {survey.featuredSurveyMedia &&
            survey.featuredSurveyMedia.thumbnailUrl && (
              <ImageModal
                open={open}
                imageUrl={survey.featuredSurveyMedia.imageUrl}
                handleClose={handleClose}
              />
            )}
        </Grid>
        <Grid className={classes.infoWrapper} container item xs={12} md={7}>
          <Grid className={classes.info} container item xs={12}>
            {survey.userId!.fullName && (
              <Grid container alignItems="center" item xs={12}>
                <Typography className={classes.cardFields} variant="h6">
                  User:
                </Typography>
                <Typography
                  className={`${classes.cardValues} ${classes.valuesWithMargin}`}
                  variant="h6"
                >
                  {survey.userId!.fullName}
                </Typography>
              </Grid>
            )}
            {survey.comments && (
              <Grid
                className={classes.commentsWrapper}
                container
                alignItems="flex-start"
                item
                xs={12}
              >
                <Grid style={{ height: "80%" }} item xs={12}>
                  <Typography className={classes.cardFields} variant="h6">
                    Comments:
                  </Typography>
                  <Typography
                    className={`${classes.cardValues} ${classes.comments}`}
                    variant="h6"
                  >
                    {survey.comments}
                  </Typography>
                </Grid>
              </Grid>
            )}
            {survey.temperature && (
              <Grid container alignItems="center" item xs={12}>
                <Typography className={classes.cardFields} variant="h6">
                  Temp:
                </Typography>
                <Typography
                  className={`${classes.cardValues} ${classes.valuesWithMargin}`}
                  variant="h6"
                >
                  {`${formatNumber(survey.temperature, 1)} °C`}
                </Typography>
              </Grid>
            )}
            <Grid
              container
              alignItems="center"
              justify="space-between"
              item
              xs={12}
            >
              <Grid item xs={10}>
                <Link
                  style={{ color: "inherit", textDecoration: "none" }}
                  to={`/reefs/${reefId}/survey_details/${survey.id}`}
                >
                  <Button size="small" variant="outlined" color="primary">
                    VIEW DETAILS
                  </Button>
                </Link>
              </Grid>
              {isAdmin && (
                <Grid container justify="flex-end" item xs={2}>
                  <DeleteButton
                    reefId={reefId}
                    surveyId={survey.id}
                    diveDate={survey.diveDate}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    ...incomingStyles,
    cardImageWrapper: {
      height: "100%",
      [theme.breakpoints.down("sm")]: {
        height: "50%",
      },
    },
    infoWrapper: {
      height: "100%",
      [theme.breakpoints.down("sm")]: {
        height: "50%",
      },
    },
    commentsWrapper: {
      maxHeight: "55%",
    },
    comments: {
      height: "100%",
      overflowY: "auto",
    },
    info: {
      height: "100%",
      padding: "0.5rem 0.5rem 0.5rem 1rem",
    },
  });

interface SurveyCardIncomingProps {
  isAdmin: boolean;
  reefId: number;
  survey: SurveyListItem;
}

type SurveyCardProps = SurveyCardIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(SurveyCard);
