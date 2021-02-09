import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Map, fromJS } from "immutable";
import { pick, isEmpty } from "lodash";
import L from "leaflet";
import isEmail from "validator/lib/isEmail";
import {
  Typography,
  Grid,
  Box,
  Paper,
  Container,
  TextField,
  Button,
  Snackbar,
  withStyles,
  WithStyles,
  createStyles,
  Theme,
  Tooltip,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useSelector, useDispatch } from "react-redux";

import NavBar from "../../common/NavBar";
import Footer from "../../common/Footer";
import RegisterDialog from "../../common/RegisterDialog";
import SignInDialog from "../../common/SignInDialog";
import LocationMap from "./LocationMap";
import { userInfoSelector, getSelf } from "../../store/User/userSlice";
import reefServices from "../../services/reefServices";
import validators from "../../helpers/validators";

const contactFormElements = [
  { id: "name", label: "Name" },
  { id: "org", label: "Organization" },
  {
    id: "email",
    label: "Email",
    validator: (email: string) => isEmail(email),
    errorMessage: "Enter a valid email",
  },
];

const Apply = ({ classes }: ApplyProps) => {
  const dispatch = useDispatch();
  const user = useSelector(userInfoSelector);
  const [formModel, setFormModel] = useState(Map<string, string | boolean>());
  const [formErrors, setFormErrors] = useState(Map<string, string>());
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [signInDialogOpen, setSignInDialogOpen] = useState(false);
  const [snackbarOpenFromDatabase, setSnackbarOpenFromDatabase] = useState(
    false
  );
  const [snackbarOpenFromCarto, setSnackbarOpenFromCarto] = useState(false);
  const [databaseSubmissionOk, setDatabaseSubmissionOk] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [newReefId, setNewReefId] = useState<number>();

  const handleRegisterDialog = (open: boolean) => setRegisterDialogOpen(open);
  const handleSignInDialog = (open: boolean) => setSignInDialogOpen(open);

  useEffect(() => {
    if (user && user.fullName && user.email) {
      setFormModel(
        formModel
          .set("name", user.fullName)
          .set("org", user.organization || " ")
          .set("email", user.email)
      );
    } else {
      setFormModel(formModel.set("name", "").set("org", "").set("email", ""));
    }
  }, [user, formModel]);

  const locationFormElements = [
    {
      id: "lat",
      label: "Latitude",
      validator: validators.isLat,
      errorMessage: "Enter a valid latitude between -90 and 90",
    },
    {
      id: "lng",
      label: "Longitude",
      validator: validators.isLong,
      errorMessage: "Enter a valid longitude between -180 and 180",
    },
    { id: "siteName", label: "Site Name" },
    {
      id: "depth",
      label: "Depth (m)",
      validator: validators.isNumeric,
      errorMessage: "Depth should be a number",
    },
  ];

  const joinedFormElements = locationFormElements.concat(contactFormElements);

  function updateFormElement(id: string, value: string | boolean) {
    setFormModel(formModel.set(id, value));
  }

  function updateMarkerPosition(position: L.LatLngTuple) {
    const [lat, lng] = position;
    setFormModel(
      formModel.set("lat", lat.toString()).set("lng", lng.toString())
    );
  }

  function handleFormSubmission() {
    const errors = joinedFormElements.reduce(
      (acc, { id, label, validator, errorMessage }) => {
        const value = formModel.get(id);
        if (!value) {
          return { ...acc, [id]: `"${label}" is required` };
        }

        if (validator && !validator(value as string)) {
          return { ...acc, [id]: errorMessage };
        }

        return acc;
      },
      {}
    );

    setFormErrors(fromJS(errors));

    if (isEmpty(errors)) {
      const { siteName, lat, lng, depth } = formModel.toJS() as {
        [key: string]: string;
      };

      // Add to database
      if (user && user.token) {
        setSubmitLoading(true);
        reefServices
          .registerReef(
            siteName,
            parseFloat(lat),
            parseFloat(lng),
            parseInt(depth, 10),
            user.token
          )
          .then(({ data }) => {
            setNewReefId(data.reef.id);
            setDatabaseSubmissionOk(true);
            setSnackbarOpenFromDatabase(true);
            if (user?.token) {
              dispatch(getSelf(user.token));
            }
          })
          .catch((error) => {
            setDatabaseSubmissionOk(false);
            setSnackbarOpenFromDatabase(true);
            console.error(error);
          })
          .finally(() => setSubmitLoading(false));
      }
    }
  }

  const textFieldProps = {
    fullWidth: true,
    variant: "outlined" as "outlined",
    size: "small" as "small",
    InputProps: { classes: pick(classes, ["root", "notchedOutline"]) },
  };

  return (
    <>
      {newReefId && <Redirect to={`/reefs/${newReefId}`} />}
      <NavBar searchLocation={false} />
      <Box className={classes.boxBar} height="100%" pt={4}>
        <Container>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Typography variant="h3" gutterBottom>
                Register your local site
              </Typography>

              <Typography>
                To get your local site registered with Aqualink to start
                tracking surface temperatures and survey imagery please complete
                the form below. Your site will become immediately available for
                you to see though some of the data will take up to 24 hours to
                show up.
              </Typography>

              <Typography>
                Once you have your site registered you can apply to get a smart
                buoy to track underwater temperatures as well. If approved,
                Aqualink will provide you with a buoy free of charge but you
                will be responsible for paying the shipping and import duties
                costs (if applicable).
              </Typography>
            </Grid>
          </Grid>
        </Container>

        <Box bgcolor="grey.100" mt={8} p={{ xs: 0, md: 4 }}>
          <Container>
            <Grid container spacing={6}>
              <Grid item xs={12} md={7}>
                <LocationMap
                  markerPositionLat={formModel.get("lat", "") as string}
                  markerPositionLng={formModel.get("lng", "") as string}
                  updateMarkerPosition={updateMarkerPosition}
                />
              </Grid>

              <Grid item xs={12} md={5}>
                <Paper elevation={2}>
                  <Box color="text.secondary" p={4}>
                    <Typography variant="h4" gutterBottom>
                      Site Information
                    </Typography>
                    {!user && (
                      <Typography variant="h6" gutterBottom>
                        Please
                        <Button
                          color="primary"
                          onClick={() => handleRegisterDialog(true)}
                        >
                          Sign up
                        </Button>
                        /
                        <Button
                          color="primary"
                          onClick={() => handleSignInDialog(true)}
                        >
                          Sign in
                        </Button>
                        before registering a new site
                      </Typography>
                    )}

                    <Grid container spacing={2}>
                      <>
                        {contactFormElements.map(({ id, label }) => (
                          <Grid item xs={12} key={label}>
                            <TextField
                              id={id}
                              disabled
                              label={label}
                              error={formErrors.get(id, "").length !== 0}
                              helperText={formErrors.get(id, "")}
                              value={formModel.get(id, "")}
                              onChange={(e) =>
                                updateFormElement(id, e.target.value)
                              }
                              {...textFieldProps}
                            />
                          </Grid>
                        ))}

                        <Grid item xs={12}>
                          <Typography>Location: Select point on map</Typography>
                        </Grid>

                        {locationFormElements.map(({ id, label }) => (
                          <Grid
                            item
                            // eslint-disable-next-line no-nested-ternary
                            xs={
                              // eslint-disable-next-line no-nested-ternary
                              id === "siteName" ? 8 : id === "depth" ? 4 : 6
                            }
                            key={label}
                          >
                            <TextField
                              id={id}
                              label={label}
                              error={formErrors.get(id, "").length !== 0}
                              helperText={formErrors.get(id, "")}
                              value={formModel.get(id, "")}
                              onChange={(e) =>
                                updateFormElement(id, e.target.value)
                              }
                              {...textFieldProps}
                            />
                          </Grid>
                        ))}

                        <Grid item xs={12}>
                          <Tooltip
                            disableHoverListener={Boolean(user)}
                            title="Please Sign up before registering a new site"
                          >
                            <div>
                              <Button
                                disabled={!user || submitLoading}
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleFormSubmission}
                              >
                                {submitLoading ? "Saving..." : "Submit"}
                              </Button>
                            </div>
                          </Tooltip>
                        </Grid>
                      </>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbarOpenFromCarto && snackbarOpenFromDatabase}
        autoHideDuration={4000}
        onClose={() => {
          setSnackbarOpenFromCarto(false);
          setSnackbarOpenFromDatabase(false);
        }}
      >
        <Alert
          onClose={() => {
            setSnackbarOpenFromCarto(false);
            setSnackbarOpenFromDatabase(false);
          }}
          severity={databaseSubmissionOk ? "success" : "error"}
          elevation={6}
          variant="filled"
        >
          {databaseSubmissionOk
            ? "Application successfully submitted."
            : "Something went wrong, please try again"}
        </Alert>
      </Snackbar>
      <Footer />
      <RegisterDialog
        open={registerDialogOpen}
        handleRegisterOpen={handleRegisterDialog}
        handleSignInOpen={handleSignInDialog}
      />
      <SignInDialog
        open={signInDialogOpen}
        handleRegisterOpen={handleRegisterDialog}
        handleSignInOpen={handleSignInDialog}
      />
    </>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    boxBar: {
      overflowX: "hidden",
    },
    listItem: {
      marginTop: theme.spacing(1),
    },

    root: {
      color: theme.palette.text.secondary,

      "&:hover $notchedOutline": {
        borderColor: theme.palette.grey[300],
      },
    },

    notchedOutline: {},

    formControlLabel: {
      marginBottom: 0,
    },
  });

type ApplyProps = WithStyles<typeof styles>;

export default withStyles(styles)(Apply);
