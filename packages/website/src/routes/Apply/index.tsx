import React, { useState } from "react";
import { Map, fromJS } from "immutable";
import { pick, some, isEmpty } from "lodash";
import L from "leaflet";
import isEmail from "validator/lib/isEmail";
import isNumeric from "validator/lib/isNumeric";
import isLatLong from "validator/lib/isLatLong";
import {
  Typography,
  Grid,
  Box,
  Paper,
  Container,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Snackbar,
  withStyles,
  WithStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import NavBar from "../../common/NavBar";
import Footer from "../../common/Footer";
import LocationMap from "./LocationMap";
import reemimage from "../../assets/img/reemimage.jpg";

const obligations = [
  "Pay for shipping and any applicable duties",
  "Obtain any necessary permits (if applicable)",
  "Provide and attach a ballast (e.g. 60lb kettlebell)",
  "Deploy spotter with mooring weight (can be done from a kayak)",
  "Maintain spotter (inspect and clean every 6 months)",
  "Conduct initial and periodic photographic surveys and upload imagery to our website",
];

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

const agreements = [
  { id: "shipping", label: "Handle any shipping and permitting charges" },
  { id: "buoy", label: "Provide mooring and deploy buoy" },
  { id: "survey", label: "Conduct initial survey" },
];

const Apply = ({ classes }: ApplyProps) => {
  const [formModel, setFormModel] = useState(Map<string, string | boolean>());
  const [formErrors, setFormErrors] = useState(Map<string, string>());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);

  const locationFormElements = [
    {
      id: "lat",
      label: "Latitude",
      validator: (lat: string) => isLatLong(`${lat},${formModel.get("lng")}`),
      errorMessage: "Enter a valid lat/lng",
    },
    { id: "lng", label: "Longitude" },
    {
      id: "depth",
      label: "Depth (m)",
      validator: isNumeric,
      errorMessage: "Depth should be a number",
    },
  ];

  const joinedFormElements = locationFormElements
    .concat(contactFormElements)
    .concat(agreements);

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
      const time = new Date().getTime();
      const date = new Date(time);

      const { name, org, email, lat, lng, depth } = formModel.toJS() as {
        [key: string]: string;
      };

      // Add to Firestore
      fetch(
        `https://us-central1-ocean-systems.cloudfunctions.net/addSite?name=${name}&org=${org}&email=${email}&lat=${lat}&lng=${lng}&depth=${depth}&date=${date}`
      )
        .then((response) => {
          setIsSuccessfullySubmitted(response.ok);
          setSnackbarOpen(true);
        })
        .catch((error) => {
          setIsSuccessfullySubmitted(false);
          setSnackbarOpen(true);
          console.error(error);
        });

      // Add to Carto
      const { REACT_APP_CARTO_API_KEY } = process.env;
      const position = JSON.stringify({
        type: "Point",
        coordinates: [lng, lat],
      });

      const sql = `INSERT INTO proposed_sites (the_geom, name, org, email, lat, lng, depth, date)
        VALUES (ST_SetSRID(ST_GeomFromGeoJSON('${position}'),4326),'${name}','${org}','${email}','${lat}','${lng}','${depth}','${date}')`;
      fetch(
        `https://drewjgray.carto.com/api/v2/sql?&q=${sql}&api_key=${REACT_APP_CARTO_API_KEY}`
      )
        .then((response) => {
          setIsSuccessfullySubmitted(response.ok);
          setSnackbarOpen(true);
        })
        .catch((error) => {
          setIsSuccessfullySubmitted(false);
          setSnackbarOpen(true);
          console.error(error);
        });
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
      <NavBar searchLocation={false} />
      <Box py={4}>
        <Container>
          <Grid container spacing={6}>
            <Grid item xs={12} md={7}>
              <Typography variant="h3" gutterBottom>
                Manage your local reef
              </Typography>

              <Typography>
                We will be starting with our deployments in August and would
                love to have you apply to get free access to our system.
                We&apos;ll have more more more information coming shortly.
                Submitting the application doesn&apos;t obligate you, if you
                have questions please first take a look at our FAQ page and if
                you don&apos;t get the answer you&apos;re looking for then email
                info@aqualink.org.
              </Typography>

              <Box mt={4}>
                <img src={reemimage} alt="Reefs" style={{ width: "100%" }} />
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box bgcolor="grey.100" p={4}>
                <Typography variant="h4" gutterBottom>
                  Your Obligations
                </Typography>

                <Typography component="div">
                  You will be given a free smart buoy but there are some things
                  you will be expected to do or provide:
                  <ol>
                    {obligations.map((item) => (
                      <li key={item} className={classes.listItem}>
                        {item}
                      </li>
                    ))}
                  </ol>
                </Typography>
              </Box>
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
                      Application Form
                    </Typography>

                    <Grid container spacing={2}>
                      <>
                        {contactFormElements.map(({ id, label }) => (
                          <Grid item xs={12} key={label}>
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
                          <Typography>Location: Select point on map</Typography>
                        </Grid>

                        {locationFormElements.map(({ id, label }) => (
                          <Grid item xs={6} key={label}>
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
                          Agree to:
                          <FormGroup>
                            {agreements.map(({ id, label }) => (
                              <FormControlLabel
                                key={label}
                                className={classes.formControlLabel}
                                control={
                                  <Checkbox
                                    color="primary"
                                    checked={
                                      formModel.get(id, false) as boolean
                                    }
                                    onChange={(_, checked) =>
                                      updateFormElement(id, checked)
                                    }
                                    name="checkedA"
                                  />
                                }
                                label={label}
                              />
                            ))}
                          </FormGroup>
                          {some(agreements, ({ id }) => formErrors.get(id)) && (
                            <Typography color="error">
                              The agreements are required
                            </Typography>
                          )}
                        </Grid>

                        <Grid item xs={12}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleFormSubmission}
                          >
                            Submit
                          </Button>
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
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={isSuccessfullySubmitted ? "success" : "error"}
          elevation={6}
          variant="filled"
        >
          {isSuccessfullySubmitted
            ? "Application successfully submitted."
            : "Something went wrong, please try again"}
        </Alert>
      </Snackbar>
      <Footer />
    </>
  );
};

const styles = (theme: Theme) =>
  createStyles({
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
