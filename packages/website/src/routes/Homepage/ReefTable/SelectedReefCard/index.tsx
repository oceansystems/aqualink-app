import React from "react";
import {
  Typography,
  Grid,
  Button,
  CardMedia,
  withStyles,
  WithStyles,
  createStyles,
  Theme,
  CircularProgress,
  Card,
  Hidden,
  Box,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import CardChart from "./cardChart";
import { sortDailyData } from "../../../../helpers/sortDailyData";
import { formatNumber } from "../../../../helpers/numberUtils";

import reefImage from "../../../../assets/reef-image.jpg";
import { degreeHeatingWeeksCalculator } from "../../../../helpers/degreeHeatingWeeks";
import { reefDetailsSelector } from "../../../../store/Reefs/selectedReefSlice";
import { Reef } from "../../../../store/Reefs/types";

const styles = (theme: Theme) =>
  createStyles({
    card: {
      padding: 40,
      [theme.breakpoints.down("xs")]: {
        padding: 10,
      },
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
      margin: theme.spacing(2),
      width: "100%",

      [theme.breakpoints.up("lg")]: {
        flexDirection: "column",
        alignItems: "start",
      },
    },
  });

type SelectedReefContentProps = WithStyles<typeof styles> & { reef: Reef };

const SelectedReefContent = withStyles(styles)(
  ({ classes, reef }: SelectedReefContentProps) => {
    const sortByDate = sortDailyData(reef.dailyData);
    const dailyDataLen = sortByDate.length;
    const {
      maxBottomTemperature,
      surfaceTemperature,
      satelliteTemperature,
      degreeHeatingDays,
    } = sortByDate[dailyDataLen - 1];

    const surfTemp = surfaceTemperature || satelliteTemperature;

    const metrics = [
      {
        label: "SURFACE TEMP",
        value: formatNumber(surfTemp, 1),
        unit: " °C",
      },
      {
        label: `TEMP AT ${reef.depth}M`,
        value: formatNumber(maxBottomTemperature, 1),
        unit: " °C",
      },
      {
        label: "HEAT STRESS",
        value: formatNumber(degreeHeatingWeeksCalculator(degreeHeatingDays), 1),
        unit: " DHW",
      },
    ];

    return (
      <Grid container spacing={1}>
        <Grid item xs={12} sm={4} lg={3}>
          <Box position="relative" height="100%">
            <CardMedia className={classes.cardImage} image={reefImage} />
            <Hidden smUp>
              <Box position="absolute" top={16} left={16}>
                <Typography variant="h5">{reef.name}</Typography>

                {reef.region?.name && (
                  <Typography variant="h6" style={{ fontWeight: 400 }}>
                    {reef.region.name}
                  </Typography>
                )}
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

        <Grid
          item
          xs={12}
          sm={8}
          lg={6}
          style={{ marginBottom: "1rem", maxHeight: "14rem" }}
        >
          <Box pb="0.5rem" pl="0.5rem" fontWeight={400}>
            <Typography color="textSecondary" variant="subtitle1">
              MEAN DAILY SURFACE TEMP. (°C)
            </Typography>
          </Box>
          <CardChart
            dailyData={reef.dailyData}
            temperatureThreshold={
              reef.maxMonthlyMean ? reef.maxMonthlyMean + 1 : null
            }
            maxMonthlyMean={reef.maxMonthlyMean || null}
          />
        </Grid>

        <Grid
          item
          xs={12}
          lg={3}
          style={{
            display: "flex",
          }}
        >
          <div className={classes.metricsContainer}>
            {metrics.map(({ label, value, unit }) => (
              <div key={label}>
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
              </div>
            ))}
          </div>
        </Grid>
      </Grid>
    );
  }
);

type SelectedReefProps = WithStyles<typeof styles>;

const SelectedReefCard = ({ classes }: SelectedReefProps) => {
  const reef = useSelector(reefDetailsSelector);

  const featuredReefId = process.env.REACT_APP_FEATURED_REEF_ID || "";

  return featuredReefId ? (
    <Box className={classes.card}>
      <Box mb={2}>
        <Typography variant="h5" color="textSecondary">
          <Hidden xsDown>{`Featured ${
            reef?.name ? `- ${reef.name}` : "Reef"
          }`}</Hidden>
          <Hidden smUp>Featured Reef</Hidden>
        </Typography>
      </Box>

      <Card>
        {reef && `${reef?.id}` === featuredReefId ? (
          <SelectedReefContent reef={reef} />
        ) : (
          <Box textAlign="center" p={4}>
            <CircularProgress size="6rem" thickness={1} />
          </Box>
        )}
      </Card>
    </Box>
  ) : null;
};

export default withStyles(styles)(SelectedReefCard);
