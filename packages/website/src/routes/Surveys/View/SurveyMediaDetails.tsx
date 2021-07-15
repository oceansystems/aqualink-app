import React from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme,
  Card,
  Grid,
  Typography,
  CardMedia,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { SurveyMedia } from "../../../store/Survey/types";
import { findOption } from "../../../constants/uploadDropdowns";
import {
  getNumberOfImages,
  getNumberOfVideos,
  getSurveyPointsByName,
} from "../../../helpers/surveyMedia";
import {
  surveyLoadingSelector,
  selectedPoiSelector,
  setFeaturedImage,
} from "../../../store/Survey/surveySlice";
import { userInfoSelector } from "../../../store/User/userSlice";
import surveyServices from "../../../services/surveyServices";
import { isAdmin } from "../../../helpers/user";

const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 960,
      settings: {
        arrows: false,
      },
    },
  ],
};

const SurveyMediaDetails = ({
  reefId,
  surveyMedia,
  classes,
}: SurveyMediaDetailsProps) => {
  const user = useSelector(userInfoSelector);
  const loading = useSelector(surveyLoadingSelector);
  const selectedPoi = useSelector(selectedPoiSelector);
  const dispatch = useDispatch();

  const onSurveyMediaUpdate = (mediaId: number) => {
    if (user && user.token) {
      surveyServices
        .editSurveyMedia(reefId, mediaId, { featured: true }, user.token)
        .then(() => {
          dispatch(setFeaturedImage(mediaId));
        })
        .catch(console.error);
    }
  };

  return (
    <>
      {surveyMedia &&
        getSurveyPointsByName(surveyMedia).map((point) => {
          const images = getNumberOfImages(point.surveyMedia);
          const videos = getNumberOfVideos(point.surveyMedia);

          return (
            <div key={point.name}>
              <Grid
                className={classes.title}
                container
                spacing={1}
                alignItems="center"
              >
                <Grid className={classes.surveyPointNameWrapper} item>
                  <Grid container spacing={1} alignItems="baseline">
                    <Grid item>
                      <Typography variant="h6">Survey Point: </Typography>
                    </Grid>
                    {point.pointId ? (
                      <Tooltip title="View survey point" arrow placement="top">
                        <Grid className={classes.surveyPointName} item>
                          <Link
                            className={classes.link}
                            to={`/reefs/${reefId}/points/${point.pointId}`}
                          >
                            <Typography
                              className={`${classes.titleName} ${
                                point.name === selectedPoi &&
                                classes.selectedPoi
                              }`}
                              variant="h6"
                            >
                              {point.name}
                            </Typography>
                          </Link>
                        </Grid>
                      </Tooltip>
                    ) : (
                      <Typography
                        className={`${classes.titleName} ${
                          point.name === selectedPoi && classes.selectedPoi
                        }`}
                        variant="h6"
                      >
                        {point.name}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                          <Typography variant="subtitle1">
                            {`${images} image`}
                            {images === 1 ? "" : "s"}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <PermMediaIcon />
                        </Grid>
                      </Grid>
                    </Grid>
                    {videos > 0 && (
                      <Grid item>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>
                            <Typography variant="subtitle1">
                              {`${videos} video`}
                              {videos === 1 ? "" : "s"}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <VideoLibraryIcon />
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Slider className={classes.carousel} {...carouselSettings}>
                {point.surveyMedia.map((media) => {
                  return (
                    <Card
                      key={media.url}
                      elevation={3}
                      className={classes.shadowBox}
                    >
                      {loading ? (
                        <Grid
                          className={classes.loading}
                          container
                          justify="center"
                          alignItems="center"
                          item
                          xs={12}
                        >
                          <CircularProgress size="4rem" thickness={1} />
                        </Grid>
                      ) : (
                        <Grid style={{ height: "100%" }} container>
                          <Grid
                            className={classes.imageWrapper}
                            item
                            sm={12}
                            md={6}
                          >
                            <CardMedia
                              className={classes.cardImage}
                              image={media.url}
                            />
                          </Grid>
                          <Grid
                            className={classes.mediaInfoWrapper}
                            container
                            item
                            sm={12}
                            md={6}
                          >
                            <Grid
                              container
                              item
                              xs={10}
                              justify="space-around"
                              alignItems="flex-start"
                              spacing={2}
                            >
                              <Grid item xs={12}>
                                <Typography variant="h6">
                                  IMAGE OBSERVATION
                                </Typography>
                                <Typography variant="subtitle1">
                                  {findOption(media.observations)}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="h6">
                                  IMAGE COMMENTS
                                </Typography>
                                <Typography variant="subtitle1">
                                  {media.comments}
                                </Typography>
                              </Grid>
                            </Grid>
                            {isAdmin(user, reefId) && (
                              <Grid container justify="flex-end" item xs={2}>
                                {media.featured ? (
                                  <Tooltip title="Featured image">
                                    <IconButton
                                      className={classes.featuredIcon}
                                    >
                                      <StarIcon color="primary" />
                                    </IconButton>
                                  </Tooltip>
                                ) : (
                                  <Tooltip title="Set as featured image">
                                    <IconButton
                                      onClick={() =>
                                        onSurveyMediaUpdate(media.id)
                                      }
                                      className={classes.featuredIcon}
                                    >
                                      <StarBorderIcon color="primary" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      )}
                    </Card>
                  );
                })}
              </Slider>
            </div>
          );
        })}
    </>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    shadowBox: {
      backgroundColor: "#f5f6f6",
      color: theme.palette.text.secondary,
      marginBottom: "4rem",
      height: "28rem",
      [theme.breakpoints.down("sm")]: {
        height: "32rem",
      },
    },
    title: {
      margin: theme.spacing(0, 1),
    },
    titleName: {
      fontSize: 18,
      lineHeight: 1.56,
      width: "100%",
      display: "block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    surveyPointNameWrapper: {
      width: "70%",
      [theme.breakpoints.down("sm")]: {
        width: "90%",
      },
    },
    surveyPointName: {
      maxWidth: "calc(100% - 120px)", // width of 100% minus the "Survey Point:" label
    },
    selectedPoi: {
      color: theme.palette.primary.main,
    },
    imageLabel: {
      display: "flex",
      whiteSpace: "pre",
    },
    imageWrapper: {
      width: "100%",
      [theme.breakpoints.down("sm")]: {
        height: "50%",
      },
    },
    cardImage: {
      width: "100%",
      height: "100%",
    },
    button: {
      marginTop: "1rem",
      textTransform: "none",
      fontWeight: "bold",
      border: "2px solid",
      "&:hover": {
        border: "2px solid",
      },
    },
    carousel: {
      marginBottom: "2rem",
    },
    featuredIcon: {
      height: "3rem",
      width: "3rem",
    },
    loading: {
      height: "100%",
    },
    mediaInfoWrapper: {
      height: "100%",
      overflowY: "auto",
      padding: "1rem 1rem 1rem 1.5rem",
      [theme.breakpoints.down("sm")]: {
        height: "50%",
      },
    },
    link: {
      textDecoration: "none",
      color: "inherit",
      "&:hover": {
        textDecoration: "none",
        color: "inherit",
      },
    },
  });

interface SurveyMediaDetailsIncomingProps {
  reefId: number;
  surveyMedia?: SurveyMedia[] | null;
}

SurveyMediaDetails.defaultProps = {
  surveyMedia: null,
};

type SurveyMediaDetailsProps = SurveyMediaDetailsIncomingProps &
  WithStyles<typeof styles>;

export default withStyles(styles)(SurveyMediaDetails);
