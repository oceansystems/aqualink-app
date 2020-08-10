/* eslint-disable no-restricted-globals */
import React, {
  useState,
  useCallback,
  BaseSyntheticEvent,
  useEffect,
} from "react";
import {
  Theme,
  AppBar,
  Toolbar,
  Grid,
  Typography,
  Button,
  createStyles,
  withStyles,
  WithStyles,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Collapse,
  Container,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useForm, Controller } from "react-hook-form";
import { RouteComponentProps } from "react-router-dom";

import Map from "./Map";
import formServices, { SendFormData } from "../services/formServices";

const Form = ({ match, classes }: FormProps) => {
  const {
    register,
    errors,
    triggerValidation,
    getValues,
    handleSubmit,
    setValue,
    reset,
    control,
  } = useForm();

  const [userName, setUserName] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [errorAlertOpen, setErrorAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [appId, setAppId] = useState<string>();

  useEffect(() => {
    const getFormData = async () => {
      try {
        const resp = await ("appHash" in match.params
          ? formServices.getFormData(match.params.appHash)
          : formServices.getFormData(match.params.appId, match.params.uid));
        const { data } = resp;
        if (data) {
          setUserName(data.user.fullName);
          setOrganization(data.user.organization);
          setLatitude(data.reef.polygon.coordinates[1]);
          setLongitude(data.reef.polygon.coordinates[0]);
          // Modifyable data
          setValue("depth", data.reef.depth);
          setValue("reefName", data.reef.name);
          setValue("installationSchedule", data.installationSchedule);
          setValue("installationResources", data.installationResources);
          setValue("fundingSource", data.fundingSource);
          setValue("permitRequirements", data.permitRequirements);
          setAppId(data.appId);
        }
      } catch (err) {
        console.error(err);
        setErrorAlertOpen(true);
        setAlertMessage(
          "Failed to load form data. Are you sure you have the right link?"
        );
      }
    };
    getFormData();
  }, [setValue, match.params]);

  const onSubmit = useCallback(
    (
      data: any,
      event?: BaseSyntheticEvent<object, HTMLElement, HTMLElement>
    ) => {
      if (event) {
        event.preventDefault();
      }

      if (!appId) {
        throw new Error("Can't submit without a valid application ID");
      }

      const sendData: SendFormData = {
        reef: {
          name: data.reefName,
          depth: parseFloat(data.depth),
        },
        reefApplication: {
          permitRequirements: data.permitRequirements,
          fundingSource: data.fundingSource,
          installationSchedule: data.installationSchedule,
          installationResources: data.installationResources,
        },
      };

      formServices
        .sendFormData(appId, sendData)
        .then(() => {
          setDialogOpen(true);
          reset();
        })
        .catch(() => {
          setErrorAlertOpen(true);
          setAlertMessage("Form submission failed");
        });
    },
    [reset, appId]
  );

  const handleChange = (prop: string) => () => triggerValidation(prop);

  const readyToSubmit =
    !!Object.keys(errors).length ||
    !getValues().reefName ||
    !getValues().permitRequirements ||
    !getValues().fundingSource ||
    !getValues().installationSchedule ||
    !getValues().installationResources;

  return (
    <>
      {/* Form page NavBar */}
      <AppBar style={{ height: 70 }} position="static">
        <Toolbar>
          <Grid container justify="center">
            <Grid item xs={10} container direction="row">
              <Typography variant="h4">Aqua</Typography>
              <Typography style={{ fontWeight: 300 }} variant="h4">
                link
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Container disableGutters maxWidth={false}>
        <Collapse in={errorAlertOpen}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setErrorAlertOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {alertMessage}
          </Alert>
        </Collapse>
      </Container>
      <Container>
        {/* Form Page Message */}
        <Grid style={{ marginTop: "4rem" }} container justify="center">
          <Grid item xs={12}>
            <Typography variant="h5">Site Information</Typography>
            <Typography style={{ fontWeight: 300 }} variant="body1">
              Please take a moment to fill out this form for each site you would
              like to manage with Aqualink.
            </Typography>
            <Typography style={{ fontWeight: 300 }} variant="body1">
              If you have any questions, don&apos;t hesitate to reach out to{" "}
              <a href="mailto:info@aqualink.org">info@aqualink.org</a>
            </Typography>
          </Grid>
        </Grid>
        <Grid
          style={{ marginTop: "4rem" }}
          container
          justify="center"
          spacing={5}
        >
          <Grid item xs={12} md={6}>
            <Grid className={classes.map} item>
              <Map
                center={latitude && longitude ? [latitude, longitude] : [0, 0]}
              />
            </Grid>
          </Grid>
          <Grid container direction="column" item xs={12} md={6}>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              {/* User Name */}
              <Typography>Your Name</Typography>
              <TextField
                inputProps={{ className: classes.nonEditableField }}
                variant="outlined"
                id="user-name"
                fullWidth
                disabled
                value={userName}
              />
              {/* Organization */}
              <Typography style={{ marginTop: "3rem" }}>
                Organization
              </Typography>
              <TextField
                inputProps={{ className: classes.nonEditableField }}
                variant="outlined"
                id="organization"
                fullWidth
                disabled
                value={organization}
              />
              {/* Site Location */}
              <Typography style={{ marginTop: "3rem" }}>Location</Typography>
              {/* Longitude and Latitude */}
              <Grid container item spacing={4}>
                <Grid item xs={6}>
                  <TextField
                    inputProps={{ className: classes.nonEditableField }}
                    name="latitude"
                    variant="outlined"
                    id="site-latitude"
                    fullWidth
                    disabled
                    placeholder="Latitude in decimal degrees"
                    value={latitude || ""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    inputProps={{ className: classes.nonEditableField }}
                    name="longitude"
                    variant="outlined"
                    id="site-longitude"
                    fullWidth
                    disabled
                    placeholder="Longitude in decimal degrees"
                    value={longitude || ""}
                  />
                </Grid>
              </Grid>
              {/* Depth */}
              <Typography style={{ marginTop: "3rem" }}>Depth (m)</Typography>
              <TextField
                inputProps={{ className: classes.textField }}
                inputRef={register({
                  required: "Depth is required",
                  pattern: {
                    value: /^\d+(\.\d+)?$/,
                    message: "Depth should be a number",
                  },
                })}
                error={!!errors.depth}
                name="depth"
                variant="outlined"
                id="site-depth"
                fullWidth
                onChange={handleChange("depth")}
                placeholder="Depth in meters"
                helperText={errors.depth ? errors.depth.message : ""}
              />
              <Typography style={{ marginTop: "3rem" }}>
                Please provide some additional information for each reef:
              </Typography>
              {/* Reef Name */}
              <Typography style={{ marginTop: "3rem" }}>Reef Name</Typography>
              <TextField
                inputProps={{ className: classes.textField }}
                inputRef={register({
                  required: "Reef Name is required",
                })}
                error={!!errors.reefName}
                variant="outlined"
                id="reef-name"
                name="reefName"
                fullWidth
                onChange={handleChange("reefName")}
                placeholder="e.g. Sombrero Reef"
                helperText={errors.reefName ? errors.reefName.message : ""}
              />
              {/* Permitting */}
              <Typography style={{ marginTop: "3rem" }}>Permitting</Typography>
              <TextField
                inputProps={{ className: classes.textField }}
                inputRef={register({
                  required: "This is a required field",
                })}
                error={!!errors.permitRequirements}
                variant="outlined"
                id="permitRequirements"
                name="permitRequirements"
                fullWidth
                multiline
                onChange={handleChange("permitRequirements")}
                placeholder="Please describe the permitting requirements. Please be sure to
              mention the authority having jurisdiction."
                helperText={
                  errors.permitRequirements
                    ? errors.permitRequirements.message
                    : ""
                }
              />
              {/* Funding Source */}
              <Typography style={{ marginTop: "3rem" }}>
                Funding Source
              </Typography>
              <TextField
                inputProps={{ className: classes.textField }}
                inputRef={register({
                  required: "This is a required field",
                })}
                error={!!errors.fundingSource}
                variant="outlined"
                id="funding-source"
                name="fundingSource"
                fullWidth
                multiline
                onChange={handleChange("fundingSource")}
                placeholder="Funding source for import duties and shipping. Please describe the funding source for the import duties and shipping costs."
                helperText={
                  errors.fundingSource ? errors.fundingSource.message : ""
                }
              />
              {/* Schedule for Installation */}
              <Typography style={{ marginTop: "3rem" }}>
                Schedule for Installation.
              </Typography>
              <Typography style={{ fontWeight: 300 }}>
                What is the soonest date after September 2020 that you could
                install the spotter and conduct a survey.
              </Typography>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Controller
                  name="installationSchedule"
                  control={control}
                  as={
                    <KeyboardDatePicker
                      margin="dense"
                      format="MM/dd/yyyy"
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      // These props will get overridden by Controller
                      onChange={() => {}}
                      value={0}
                    />
                  }
                />
              </MuiPickersUtilsProvider>
              {/* Installation, survey and maintenance personnel and equipment */}
              <Typography style={{ marginTop: "3rem" }}>
                Installation, survey and maintenance personnel and equipment
              </Typography>
              <TextField
                inputProps={{ className: classes.textField }}
                inputRef={register({
                  required: "This is a required field",
                })}
                error={!!errors.installation}
                variant="outlined"
                id="installationResources"
                name="installationResources"
                fullWidth
                multiline
                onChange={handleChange("installationResources")}
                placeholder="Please provide a description of the people that will be able to conduct periodic surveys and maintenance of the buoy. Please also include a description of the equipment (e.g. a boat, cameras) that are available."
                helperText={
                  errors.installationResources
                    ? errors.installationResources.message
                    : ""
                }
              />
              {/* Successful Submission Dialog */}
              <Dialog open={dialogOpen}>
                <DialogTitle
                  className={classes.successDialogTitle}
                  id="successful-submission-dialog-title"
                >
                  Success!
                </DialogTitle>
                <DialogContent className={classes.successDialogContent}>
                  <DialogContentText
                    className={classes.successDialogContentText}
                    id="successful-submission-dialog-content"
                  >
                    Thank you for submitting your form. If you applied for other
                    reefs, make sure to fill in their forms as well.
                  </DialogContentText>
                </DialogContent>
                <DialogActions className={classes.successDialogActions}>
                  <Button color="primary" href="https://www.aqualink.org/">
                    Visit Aqualink.org
                  </Button>
                </DialogActions>
              </Dialog>
              <Grid style={{ margin: "3rem 0 3rem 0" }} item>
                <Button
                  disabled={readyToSubmit}
                  type="submit"
                  color="primary"
                  variant="contained"
                >
                  Submit
                </Button>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Container>
      {/* Form page Footer */}
      <AppBar position="static">
        <Toolbar>
          <Grid container justify="center">
            <Grid item xs={10} container direction="row">
              <Typography variant="h4">Aqua</Typography>
              <Typography style={{ fontWeight: 300 }} variant="h4">
                link
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    select: {
      width: "100%",
      color: "black",
      marginTop: "1rem",
      marginBottom: "1rem",
    },
    nonEditableField: {
      backgroundColor: "#E6E6E6",
    },
    menuItem: {
      color: "black",
    },
    textField: {
      color: "black",
    },
    map: {
      height: "40vh",
      width: "100%",

      [theme.breakpoints.down("md")]: {
        marginBottom: "3rem",
      },
    },
    successDialogTitle: {
      backgroundColor: theme.palette.primary.dark,
    },
    successDialogContent: {
      backgroundColor: theme.palette.primary.dark,
    },
    successDialogContentText: {
      color: theme.palette.text.primary,
    },
    successDialogActions: {
      backgroundColor: theme.palette.primary.dark,
    },
  });

interface MatchProps
  extends RouteComponentProps<
    | {
        appId: string;
        uid: string;
      }
    | {
        appHash: string;
      }
  > {}

type FormProps = WithStyles<typeof styles> & MatchProps;

export default withStyles(styles)(Form);
