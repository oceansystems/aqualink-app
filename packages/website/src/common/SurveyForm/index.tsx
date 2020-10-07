import React, { useState, useCallback, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme,
  Grid,
  Typography,
  MenuItem,
  TextField,
  Button,
} from "@material-ui/core";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { Link } from "react-router-dom";
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useForm } from "react-hook-form";

import { diveLocationSelector } from "../../store/Survey/surveySlice";
import { SurveyData, SurveyState } from "../../store/Survey/types";

const SurveyForm = ({ reefId, onSubmit, classes }: SurveyFormProps) => {
  const diveLocation = useSelector(diveLocationSelector);
  const [diveDateTime, setDiveDateTime] = useState<Date | null>(null);
  const [weather, setWeather] = useState<SurveyData["weatherConditions"]>(
    "calm"
  );

  const { register, errors, handleSubmit, reset } = useForm({
    reValidateMode: "onSubmit",
  });

  const handleDiveDateTimeChange = (date: Date | null) => {
    if (date) {
      setDiveDateTime(date);
    }
  };

  const handleWeatherChange = (event: ChangeEvent<{ value: unknown }>) => {
    setWeather(event.target.value as SurveyData["weatherConditions"]);
  };

  const nativeSubmit = useCallback(
    (data: any) => {
      if (diveDateTime) {
        const dateTime = diveDateTime.toISOString();
        const weatherConditions = weather;
        const { comments } = data;
        onSubmit(dateTime, diveLocation, weatherConditions, comments);
      }
    },
    [onSubmit, diveDateTime, weather, diveLocation]
  );

  const resetForm = () => {
    reset({
      diveTime: null,
      diveDate: null,
      comments: null,
    });
    setDiveDateTime(null);
    setWeather("calm");
  };

  return (
    <form onSubmit={handleSubmit(nativeSubmit)}>
      {/* Dive Date and Time */}
      <Grid
        style={{ marginBottom: "1rem" }}
        container
        justify="space-between"
        item
        xs={12}
      >
        <Grid item xs={5}>
          <Typography variant="h6">Dive Date</Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography variant="h6">Dive Time</Typography>
        </Grid>
      </Grid>
      <Grid
        style={{ marginBottom: "1rem" }}
        container
        justify="space-between"
        item
        xs={12}
      >
        <Grid item xs={5}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              className={classes.textField}
              disableToolbar
              format="MM/dd/yyyy"
              id="dive-date"
              name="diveDate"
              autoOk
              showTodayButton
              helperText={errors?.diveDate?.message || ""}
              inputRef={register({
                required: "This is a required field",
                validate: {
                  validDate: (value) =>
                    moment(value, "MM/DD/YYYY", true).isValid() ||
                    "Invalid date",
                },
              })}
              error={!!errors.diveDate}
              value={diveDateTime}
              onChange={handleDiveDateTimeChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              inputProps={{
                className: classes.textField,
              }}
              inputVariant="outlined"
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={5}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker
              className={classes.textField}
              id="time-picker"
              name="diveTime"
              autoOk
              helperText={errors?.diveTime?.message || ""}
              inputRef={register({
                required: "This is a required field",
                pattern: {
                  value: /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
                  message: "Invalid time format",
                },
              })}
              error={!!errors.diveTime}
              format="HH:mm"
              value={diveDateTime}
              onChange={handleDiveDateTimeChange}
              KeyboardButtonProps={{
                "aria-label": "change time",
              }}
              InputProps={{
                className: classes.textField,
              }}
              keyboardIcon={<AccessTimeIcon />}
              inputVariant="outlined"
            />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
      {/* Dive Location */}
      <Grid style={{ marginBottom: "1rem" }} item xs={12}>
        <Typography variant="h6">Dive Location</Typography>
      </Grid>
      <Grid
        style={{ marginBottom: "2rem" }}
        container
        justify="space-between"
        item
        xs={12}
      >
        <Grid item xs={5}>
          <TextField
            variant="outlined"
            inputProps={{ className: classes.textField }}
            fullWidth
            placeholder="LAT"
            label="Latitude"
            value={diveLocation?.lat || ""}
            disabled
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            variant="outlined"
            inputProps={{ className: classes.textField }}
            fullWidth
            placeholder="LONG"
            label="Longitude"
            value={diveLocation?.lng || ""}
            disabled
          />
        </Grid>
      </Grid>
      {/* Weather Conditions */}
      <Grid style={{ marginBottom: "1rem" }} item xs={12}>
        <Typography variant="h6">Weather Conditions</Typography>
      </Grid>
      <Grid style={{ marginBottom: "2rem" }} item xs={12}>
        <TextField
          className={classes.textField}
          select
          id="weather"
          name="weather"
          value={weather}
          onChange={handleWeatherChange}
          placeholder="Select One"
          fullWidth
          variant="outlined"
          inputProps={{
            className: classes.textField,
          }}
        >
          <MenuItem className={classes.textField} value="calm">
            Calm
          </MenuItem>
          <MenuItem className={classes.textField} value="waves">
            Waves
          </MenuItem>
          <MenuItem className={classes.textField} value="storm">
            Stormy
          </MenuItem>
        </TextField>
      </Grid>
      <Grid style={{ marginBottom: "1rem" }} item xs={12}>
        <Typography variant="h6">Comments</Typography>
      </Grid>
      <Grid style={{ marginBottom: "2rem" }} item xs={12}>
        <TextField
          className={classes.textField}
          variant="outlined"
          multiline
          name="comments"
          placeholder="Did anything stand out during this survey"
          inputRef={register()}
          fullWidth
          inputProps={{
            className: classes.textField,
          }}
        />
      </Grid>
      {/* SUBMIT */}
      <Grid
        style={{ marginBottom: "1rem" }}
        container
        justify="flex-end"
        item
        xs={12}
      >
        <Grid style={{ marginRight: "3rem" }} item xs={2}>
          <Link to={`/reefs/${reefId}`} style={{ textDecoration: "none" }}>
            <Button onClick={resetForm} color="primary" variant="outlined">
              Cancel
            </Button>
          </Link>
        </Grid>
        <Grid style={{ marginRight: "3rem" }} item xs={2}>
          <Button onClick={resetForm} color="primary" variant="outlined">
            Clear
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button type="submit" color="primary" variant="contained">
            Next
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    textField: {
      color: "black",
      "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(0, 0, 0, 0.23)",
      },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
    },
  });

interface SurveyFormIncomingProps {
  reefId: number;
  onSubmit: (
    diveDateTime: string,
    diveLocation: SurveyState["diveLocation"],
    weatherConditions: SurveyData["weatherConditions"],
    comments: string
  ) => void;
}

type SurveyFormProps = SurveyFormIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(SurveyForm);
