import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  withStyles,
  WithStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

import Chart from "./Chart";
import TempAnalysis from "./TempAnalysis";
import {
  reefHoboDataRequest,
  reefHoboDataSelector,
  reefSpotterDataRequest,
  reefSpotterDataSelector,
} from "../../../../store/Reefs/selectedReefSlice";
import { Metrics, Reef } from "../../../../store/Reefs/types";
import {
  findMarginalDate,
  setTimeZone,
  subtractFromDate,
} from "../../../../helpers/dates";

const ChartWithCard = ({ reef, pointId, classes }: ChartWithCardProps) => {
  const dispatch = useDispatch();
  const spotterData = useSelector(reefSpotterDataSelector);
  const { bottomTemperature: hoboBottomTemperature } =
    useSelector(reefHoboDataSelector) || {};
  const hasSpotterData = Boolean(reef.liveData.surfaceTemperature);
  const [pickerEndDate, setPickerEndDate] = useState<string>(
    new Date(moment().format("MM/DD/YYYY")).toISOString()
  );
  const [pickerStartDate, setPickerStartDate] = useState<string>(
    subtractFromDate(
      new Date(moment().format("MM/DD/YYYY")).toISOString(),
      "week"
    )
  );
  const [endDate, setEndDate] = useState<string>();
  const [startDate, setStartDate] = useState<string>();

  // Get spotter data
  useEffect(() => {
    const reefLocalStartDate = setTimeZone(
      new Date(pickerStartDate),
      reef.timezone
    ) as string;

    const reefLocalEndDate = setTimeZone(
      new Date(pickerEndDate),
      reef.timezone
    ) as string;

    dispatch(
      reefHoboDataRequest({
        reefId: `${reef.id}`,
        pointId,
        start: reefLocalStartDate,
        end: reefLocalEndDate,
        metrics: [Metrics.bottomTemperature],
      })
    );

    if (hasSpotterData) {
      dispatch(
        reefSpotterDataRequest({
          id: `${reef.id}`,
          startDate: reefLocalStartDate,
          endDate: reefLocalEndDate,
        })
      );
    }
  }, [
    dispatch,
    hasSpotterData,
    pickerEndDate,
    pickerStartDate,
    pointId,
    reef.id,
    reef.timezone,
  ]);

  useEffect(() => {
    if (
      (spotterData && spotterData.bottomTemperature.length > 0) ||
      (hoboBottomTemperature && hoboBottomTemperature.length > 0)
    ) {
      const maxDataDate = new Date(
        findMarginalDate(reef.dailyData, spotterData, hoboBottomTemperature)
      );
      const minDataDate = new Date(
        findMarginalDate(
          reef.dailyData,
          spotterData,
          hoboBottomTemperature,
          "min"
        )
      );
      const reefLocalEndDate = new Date(
        setTimeZone(
          new Date(moment(pickerEndDate).format("MM/DD/YYYY")),
          reef?.timezone
        ) as string
      );
      const reefLocalStartDate = new Date(
        setTimeZone(
          new Date(moment(pickerStartDate).format("MM/DD/YYYY")),
          reef?.timezone
        ) as string
      );

      if (maxDataDate.getTime() > reefLocalEndDate.getTime()) {
        setEndDate(reefLocalEndDate.toISOString());
      } else {
        setEndDate(maxDataDate.toISOString());
      }

      if (minDataDate.getTime() > reefLocalStartDate.getTime()) {
        setStartDate(minDataDate.toISOString());
      } else {
        setStartDate(reefLocalStartDate.toISOString());
      }
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [
    hoboBottomTemperature,
    pickerEndDate,
    pickerStartDate,
    reef,
    spotterData,
  ]);

  return (
    <Container>
      <Grid className={classes.chartWrapper} container item spacing={2}>
        <Grid item xs={12} md={9}>
          <Chart
            reef={reef}
            pointId={parseInt(pointId, 10)}
            spotterData={spotterData}
            hoboBottomTemperature={hoboBottomTemperature}
            pickerStartDate={pickerStartDate}
            pickerEndDate={pickerEndDate}
            startDate={startDate || pickerStartDate}
            endDate={endDate || pickerEndDate}
            onStartDateChange={(date) =>
              setPickerStartDate(
                new Date(moment(date).format("MM/DD/YYYY")).toISOString()
              )
            }
            onEndDateChange={(date) =>
              setPickerEndDate(
                new Date(moment(date).format("MM/DD/YYYY")).toISOString()
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid container justify="center">
            <Grid item xs={11} sm={5} md={11} lg={10}>
              <TempAnalysis
                startDate={pickerStartDate}
                endDate={pickerEndDate}
                depth={reef.depth}
                spotterData={spotterData}
                dailyData={reef.dailyData}
                hoboBottomTemperature={hoboBottomTemperature || []}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    chartWrapper: {
      margin: "80px 0 20px 0",
      [theme.breakpoints.down("xs")]: {
        margin: "40px 0 10px 0",
      },
    },
  });

interface ChartWithCardIncomingProps {
  reef: Reef;
  pointId: string;
}

type ChartWithCardProps = ChartWithCardIncomingProps &
  WithStyles<typeof styles>;

export default withStyles(styles)(ChartWithCard);