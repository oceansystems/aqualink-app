import React, { ElementType } from "react";
import {
  createStyles,
  Grid,
  withStyles,
  WithStyles,
  Theme,
  Box,
} from "@material-ui/core";
import moment from "moment";

import Map from "./Map";
import FeaturedMedia from "./FeaturedMedia";
import Satellite from "./Satellite";
import Sensor from "./Sensor";
import CoralBleaching from "./CoralBleaching";
import Waves from "./Waves";
import Charts from "./Charts";
import Surveys from "./Surveys";
import CardTitle, { Value } from "./CardTitle";
import type { Reef } from "../../../store/Reefs/types";
import { locationCalculator } from "../../../helpers/locationCalculator";
import { formatNumber } from "../../../helpers/numberUtils";
import { SurveyPoint } from "../../../store/Survey/types";

const ReefDetails = ({ classes, reef, point, diveDate }: ReefDetailProps) => {
  const [lng, lat] = locationCalculator(reef.polygon);

  const { liveData, maxMonthlyMean } = reef;
  const cards = [
    {
      Component: Satellite as ElementType,
      props: { liveData, maxMonthlyMean },
    },
    {
      Component: Sensor as ElementType,
      props: { reef },
    },
    {
      Component: CoralBleaching as ElementType,
      props: { liveData, maxMonthlyMean },
    },
    {
      Component: Waves as ElementType,
      props: { liveData },
    },
  ];

  const mapTitleItems: Value[] = [
    {
      text: "LOCATION:",
      variant: "h6",
      marginRight: "2rem",
    },
    {
      text: `LAT: ${formatNumber(lat, 3)}`,
      variant: "subtitle2",
      marginRight: "1rem",
    },
    {
      text: `LONG: ${formatNumber(lng, 3)}`,
      variant: "subtitle2",
      marginRight: 0,
    },
  ];

  const featuredMediaTitleItems: Value[] = [
    {
      text: "SURVEY DATE:",
      variant: "h6",
      marginRight: "0.5rem",
    },
    {
      text: `${moment(moment(diveDate).toISOString()).format("MM/DD/YYYY")}`,
      variant: "subtitle2",
      marginRight: "2rem",
    },
    {
      text: "SURVEY POINT:",
      variant: "h6",
      marginRight: "0.5rem",
    },
    {
      text: `${point?.name}`,
      variant: "subtitle2",
      marginRight: 0,
    },
  ];

  return (
    <Box mt="1rem">
      {(!diveDate || !point) && <CardTitle values={mapTitleItems} />}

      <Grid container justify="space-between" spacing={4}>
        <Grid item xs={12} md={6}>
          {diveDate && point && <CardTitle values={mapTitleItems} />}
          <div className={classes.container}>
            <Map polygon={reef.polygon} />
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.container}>
            {diveDate && point && (
              <CardTitle values={featuredMediaTitleItems} />
            )}
            <FeaturedMedia
              url={reef.videoStream}
              featuredImage={reef.featuredImage}
            />
          </div>
        </Grid>
      </Grid>

      <Grid container justify="space-between" spacing={4}>
        {cards.map(({ Component, props }, index) => (
          <Grid key={index.toString()} item xs={12} sm={6} md={3}>
            <Component {...props} />
          </Grid>
        ))}
      </Grid>

      <Box mt="2rem">
        <Charts
          dailyData={reef.dailyData}
          depth={reef.depth}
          maxMonthlyMean={reef.maxMonthlyMean || null}
          temperatureThreshold={
            reef.maxMonthlyMean ? reef.maxMonthlyMean + 1 : null
          }
        />
        <Surveys reefId={reef.id} />
      </Box>
    </Box>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginTop: "2rem",
    },
    container: {
      height: "30rem",
      marginBottom: "2rem",
      [theme.breakpoints.between("md", 1440)]: {
        height: "25rem",
      },
      [theme.breakpoints.down("xs")]: {
        height: "20rem",
      },
    },
  });

interface ReefDetailIncomingProps {
  reef: Reef;
  point?: SurveyPoint | null;
  diveDate?: string | null;
}

ReefDetails.defaultProps = {
  point: null,
  diveDate: null,
};

type ReefDetailProps = ReefDetailIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(ReefDetails);
