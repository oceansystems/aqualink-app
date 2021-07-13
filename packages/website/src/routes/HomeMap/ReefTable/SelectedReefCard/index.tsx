/* eslint-disable no-nested-ternary */
import React from "react";
import { isNumber } from "lodash";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
  Hidden,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import LaunchIcon from "@material-ui/icons/Launch";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { sortByDate } from "../../../../helpers/sortDailyData";
import { formatNumber } from "../../../../helpers/numberUtils";

import { degreeHeatingWeeksCalculator } from "../../../../helpers/degreeHeatingWeeks";
import {
  reefDetailsSelector,
  reefLoadingSelector,
} from "../../../../store/Reefs/selectedReefSlice";
import { getReefNameAndRegion } from "../../../../store/Reefs/helpers";
import { Reef } from "../../../../store/Reefs/types";
import Chart from "../../../../common/Chart";
import { surveyListSelector } from "../../../../store/Survey/surveyListSlice";
import { convertDailyDataToLocalTime } from "../../../../helpers/dates";
import Chip from "../../../../common/Chip";

const useStyles = makeStyles((theme) => ({
  cardWrapper: {
    minHeight: "18rem",
    [theme.breakpoints.down("md")]: {
      minHeight: "22rem",
    },
  },
  mobileCardWrapperWithImage: {
    [theme.breakpoints.down("xs")]: {
      height: "42rem",
    },
  },
  mobileCardWrapperWithNoImage: {
    [theme.breakpoints.down("xs")]: {
      height: "27rem",
    },
  },
  card: {
    [theme.breakpoints.down("xs")]: {
      padding: 10,
    },
    padding: 20,
  },
  cardImage: {
    borderRadius: "4px 0 0 4px",
    height: "100%",

    [theme.breakpoints.down("xs")]: {
      height: 300,
    },
  },
  metricsContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },

    [theme.breakpoints.up("lg")]: {
      flexDirection: "column",
      alignItems: "start",
    },
  },
  launchIcon: {
    fontSize: 20,
    marginLeft: "0.5rem",
    color: "#2f2f2f",
    "&:hover": {
      color: "#2f2f2f",
    },
  },
  reefRegionName: {
    marginBottom: "0.6rem",
  },
  cardTitleWrapper: {
    maxWidth: "calc(100% - 88px)",
    marginRight: theme.spacing(1),
  },
  cardTitle: {
    width: "100%",
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
}));

type SelectedReefContentProps = {
  reef: Reef;
  imageUrl?: string | null;
};

const SelectedReefContent = ({ reef, imageUrl }: SelectedReefContentProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const sortedDailyData = sortByDate(reef.dailyData, "date");
  const dailyDataLen = sortedDailyData.length;
  const { maxBottomTemperature, satelliteTemperature, degreeHeatingDays } =
    (dailyDataLen && sortedDailyData[dailyDataLen - 1]) || {};

  const metrics = [
    {
      label: "SURFACE TEMP",
      value: formatNumber(satelliteTemperature, 1),
      unit: " °C",
      display: isNumber(satelliteTemperature),
    },
    {
      label: "HEAT STRESS",
      value: formatNumber(degreeHeatingWeeksCalculator(degreeHeatingDays), 1),
      unit: " DHW",
      display: isNumber(degreeHeatingDays),
    },
    {
      label: `TEMP AT ${reef.depth}m`,
      value: formatNumber(maxBottomTemperature, 1),
      unit: " °C",
      display: isNumber(maxBottomTemperature),
    },
  ];

  const { name, region: regionName } = getReefNameAndRegion(reef);

  const ChartComponent = (
    <Chart
      reefId={reef.id}
      dailyData={convertDailyDataToLocalTime(reef.dailyData, reef.timezone)}
      surveys={[]}
      temperatureThreshold={
        reef.maxMonthlyMean ? reef.maxMonthlyMean + 1 : null
      }
      maxMonthlyMean={reef.maxMonthlyMean || null}
      background
    />
  );

  return (
    <Grid
      className={
        imageUrl
          ? `${classes.cardWrapper} ${classes.mobileCardWrapperWithImage}`
          : `${classes.cardWrapper} ${classes.mobileCardWrapperWithNoImage}`
      }
      container
      justify="space-between"
      spacing={1}
    >
      {imageUrl && (
        <Grid item xs={12} sm={6} lg={4}>
          <Box position="relative" height="100%">
            <Link to={`/reefs/${reef.id}`}>
              <CardMedia className={classes.cardImage} image={imageUrl} />
            </Link>

            <Hidden smUp>
              <Box
                bgcolor="rgba(3, 48, 66, 0.75)"
                height="40%"
                width="100%"
                position="absolute"
                top={0}
                left={0}
              >
                <Box position="absolute" top={16} left={16}>
                  <Typography variant="h5">{name}</Typography>

                  {regionName && (
                    <Typography variant="h6" style={{ fontWeight: 400 }}>
                      {regionName}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Hidden>

            <Box position="absolute" bottom={16} px={2} width="100%">
              <Grid
                container
                alignItems="center"
                justify={
                  reef.videoStream && isMobile ? "space-between" : "flex-end"
                }
              >
                {reef.videoStream && isMobile && (
                  <Chip
                    live
                    liveText="LIVE VIDEO"
                    to={`/reefs/${reef.id}`}
                    width={80}
                  />
                )}
                <Grid item>
                  <Link
                    style={{ color: "inherit", textDecoration: "none" }}
                    to={`/reefs/${reef.id}`}
                  >
                    <Button size="small" variant="contained" color="primary">
                      EXPLORE
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      )}

      <Grid
        item
        xs={12}
        sm={imageUrl ? 6 : 12}
        lg={imageUrl ? 6 : 10}
        style={{ marginBottom: "2rem", maxHeight: "14rem" }}
      >
        <Box pb="0.5rem" pl="0.5rem" pt="1.5rem" fontWeight={400}>
          <Hidden xsDown={Boolean(imageUrl)}>
            <Grid container alignItems="center">
              <Grid item className={classes.cardTitleWrapper}>
                <Typography
                  className={classes.cardTitle}
                  color="textSecondary"
                  variant="h5"
                >
                  <span title={name || ""}>{name}</span>
                </Typography>
              </Grid>
              {reef.videoStream && (
                <Chip
                  live
                  liveText="LIVE VIDEO"
                  to={`/reefs/${reef.id}`}
                  width={80}
                />
              )}
            </Grid>
            <Typography
              color="textSecondary"
              variant="h6"
              className={`${classes.cardTitle} ${classes.reefRegionName}`}
            >
              <span title={regionName || ""}>{regionName}</span>
            </Typography>
          </Hidden>
          <Typography color="textSecondary" variant="caption">
            DAILY SURFACE TEMP. (°C)
          </Typography>
        </Box>
        <Hidden xsDown>
          <div>{ChartComponent}</div>
        </Hidden>
        <Hidden smUp>{ChartComponent}</Hidden>
      </Grid>

      <Grid
        item
        xs={12}
        lg={2}
        style={{
          display: "flex",
        }}
      >
        <div className={classes.metricsContainer}>
          {metrics.map(({ label, value, unit, display }) => (
            <div key={label}>
              {display && (
                <>
                  <Typography variant="caption" color="textSecondary">
                    {label}
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {value}
                    &nbsp;
                    <Typography variant="h6" component="span">
                      {unit}
                    </Typography>
                  </Typography>
                </>
              )}
            </div>
          ))}
        </div>
      </Grid>
    </Grid>
  );
};

SelectedReefContent.defaultProps = {
  imageUrl: null,
};

const featuredReefId = process.env.REACT_APP_FEATURED_REEF_ID || "";

const SelectedReefCard = () => {
  const classes = useStyles();
  const reef = useSelector(reefDetailsSelector);
  const loading = useSelector(reefLoadingSelector);
  const surveyList = useSelector(surveyListSelector);

  const isFeatured = `${reef?.id}` === featuredReefId;

  const { featuredSurveyMedia } =
    sortByDate(surveyList, "diveDate", "desc").find(
      (survey) =>
        survey.featuredSurveyMedia &&
        survey.featuredSurveyMedia.type === "image"
    ) || {};

  const hasMedia = Boolean(featuredSurveyMedia?.url);

  return (
    <Box className={classes.card}>
      {!loading && (
        <Box mb={2}>
          <Typography variant="h5" color="textSecondary">
            {isFeatured ? "Featured Site" : "Selected Site"}
            {!hasMedia && (
              <Link to={`reefs/${reef?.id}`}>
                <LaunchIcon className={classes.launchIcon} />
              </Link>
            )}
          </Typography>
        </Box>
      )}

      <Card>
        {loading ? (
          <Box
            height="20rem"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            p={4}
          >
            <CircularProgress size="3rem" thickness={1} />
          </Box>
        ) : reef ? (
          <SelectedReefContent
            reef={reef}
            imageUrl={featuredSurveyMedia?.url}
          />
        ) : null}
      </Card>
    </Box>
  );
};

export default SelectedReefCard;
