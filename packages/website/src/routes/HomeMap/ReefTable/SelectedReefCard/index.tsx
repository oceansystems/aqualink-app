/* eslint-disable no-nested-ternary */
import React, { useEffect } from "react";
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
} from "@material-ui/core";
import LaunchIcon from "@material-ui/icons/Launch";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { sortByDate } from "../../../../helpers/sortDailyData";
import { formatNumber } from "../../../../helpers/numberUtils";

import { degreeHeatingWeeksCalculator } from "../../../../helpers/degreeHeatingWeeks";
import {
  reefDetailsSelector,
  reefLoadingSelector,
  reefRequest,
} from "../../../../store/Reefs/selectedReefSlice";
import { getReefNameAndRegion } from "../../../../store/Reefs/helpers";
import { Reef } from "../../../../store/Reefs/types";
import Chart from "../../../../common/Chart";
import { reefOnMapSelector } from "../../../../store/Homepage/homepageSlice";
import {
  surveyListSelector,
  surveysRequest,
} from "../../../../store/Survey/surveyListSlice";

const useStyles = makeStyles((theme) => ({
  cardWrapper: {
    height: "18rem",
    [theme.breakpoints.down("md")]: {
      height: "22rem",
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
  cardTitle: {
    width: "90%",
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
}));

type SelectedReefContentProps = {
  reef: Reef;
  url?: string | null;
};

const SelectedReefContent = ({ reef, url }: SelectedReefContentProps) => {
  const classes = useStyles();

  const sortedDailyData = sortByDate(reef.dailyData, "date");
  const dailyDataLen = sortedDailyData.length;
  const {
    maxBottomTemperature,
    satelliteTemperature,
    degreeHeatingDays,
  } = sortedDailyData[dailyDataLen - 1];

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
      dailyData={reef.dailyData}
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
        url
          ? `${classes.cardWrapper} ${classes.mobileCardWrapperWithImage}`
          : `${classes.cardWrapper} ${classes.mobileCardWrapperWithNoImage}`
      }
      container
      justify="space-between"
      spacing={1}
    >
      {url && (
        <Grid item xs={12} sm={6} lg={4}>
          <Box position="relative" height="100%">
            <CardMedia className={classes.cardImage} image={url} />

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

            <Box position="absolute" bottom={16} right={16}>
              <Link
                style={{ color: "inherit", textDecoration: "none" }}
                to={`/reefs/${reef.id}`}
              >
                <Button size="small" variant="contained" color="primary">
                  EXPLORE
                </Button>
              </Link>
            </Box>
          </Box>
        </Grid>
      )}

      <Grid
        item
        xs={12}
        sm={url ? 6 : 12}
        lg={url ? 6 : 10}
        style={{ marginBottom: "2rem", maxHeight: "14rem" }}
      >
        <Box pb="0.5rem" pl="0.5rem" pt="1.5rem" fontWeight={400}>
          <Hidden xsDown={Boolean(url)}>
            <Typography
              className={classes.cardTitle}
              color="textSecondary"
              variant="h5"
            >
              <span title={name || ""}>{name}</span>
            </Typography>
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
  url: null,
};

const featuredReefId = process.env.REACT_APP_FEATURED_REEF_ID || "";

const SelectedReefCard = () => {
  const classes = useStyles();
  const reef = useSelector(reefDetailsSelector);
  const loading = useSelector(reefLoadingSelector);
  const reefOnMap = useSelector(reefOnMapSelector);
  const surveyList = useSelector(surveyListSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!reefOnMap) {
      dispatch(reefRequest(featuredReefId));
      dispatch(surveysRequest(featuredReefId));
    } else {
      dispatch(reefRequest(`${reefOnMap.id}`));
      dispatch(surveysRequest(`${reefOnMap.id}`));
    }
  }, [dispatch, reefOnMap]);

  const isFeatured = `${reef?.id}` === featuredReefId;

  const featuredMedia = sortByDate(surveyList, "diveDate", "desc").find(
    (survey) =>
      survey.featuredSurveyMedia && survey.featuredSurveyMedia.type === "image"
  )?.featuredSurveyMedia;

  const hasMedia = Boolean(featuredMedia?.imageUrl);

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
            <CircularProgress size="6rem" thickness={1} />
          </Box>
        ) : reef ? (
          <SelectedReefContent reef={reef} url={featuredMedia?.imageUrl} />
        ) : null}
      </Card>
    </Box>
  );
};

export default SelectedReefCard;
