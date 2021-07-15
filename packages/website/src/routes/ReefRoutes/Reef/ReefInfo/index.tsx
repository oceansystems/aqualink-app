import React, { useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  withStyles,
  WithStyles,
  createStyles,
  Button,
  Collapse,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ArrowBack from "@material-ui/icons/ArrowBack";

import EditForm from "./EditForm";
import ExclusionDatesDialog from "./ExclusionDatesDialog";
import {
  setSelectedReef,
  setReefData,
  setReefDraft,
} from "../../../../store/Reefs/selectedReefSlice";
import { Reef, ReefUpdateParams } from "../../../../store/Reefs/types";
import { getReefNameAndRegion } from "../../../../store/Reefs/helpers";
import reefServices from "../../../../services/reefServices";
import {
  setAdministeredReefs,
  userInfoSelector,
} from "../../../../store/User/userSlice";
import { displayTimeInLocalTimezone } from "../../../../helpers/dates";
import CollectionButton from "./CollectionButton";
import {
  reefsListSelector,
  setReefs,
} from "../../../../store/Reefs/reefsListSlice";

const ReefNavBar = ({
  hasDailyData,
  reef,
  lastSurvey,
  isAdmin,
  classes,
}: ReefNavBarProps) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector(userInfoSelector);
  const reefsList = useSelector(reefsListSelector);
  const [editEnabled, setEditEnabled] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">();
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const { name: reefName, region: reefRegion } = getReefNameAndRegion(reef);
  const organizationName = reef.admins[0]?.organization;
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [
    exclusionDatesDialogOpen,
    setExclusionDatesDeployDialogOpen,
  ] = useState(false);

  const clearReefInfo = () => {
    if (!hasDailyData) {
      dispatch(setSelectedReef(null));
    }
  };

  const onCloseForm = () => {
    dispatch(setReefDraft(null));
    setEditEnabled(false);
  };

  const onOpenForm = () => {
    if (reef.depth && reef.polygon.type === "Point") {
      dispatch(
        setReefDraft({
          name: reefName || "",
          depth: reef.depth,
          coordinates: {
            longitude: reef.polygon.coordinates[0],
            latitude: reef.polygon.coordinates[1],
          },
        })
      );
    }
    setEditEnabled(true);
  };

  const handleFormSubmit = (data: ReefUpdateParams) => {
    if (user && user.token) {
      setFormSubmitLoading(true);
      reefServices
        .updateReef(reef.id, data, user.token)
        .then(() => dispatch(setReefData(data)))
        .then(() => {
          dispatch(
            setAdministeredReefs(
              user?.administeredReefs?.map((item) =>
                item.id === reef.id && data.name
                  ? { ...item, name: data.name }
                  : item
              )
            )
          );
          dispatch(
            setReefs(
              reefsList?.map((item) =>
                item.id === reef.id && data.name
                  ? { ...item, name: data.name }
                  : item
              )
            )
          );
        })
        .then(() => setAlertSeverity("success"))
        .catch(() => setAlertSeverity("error"))
        .finally(() => {
          dispatch(setReefDraft(null));
          setEditEnabled(false);
          setAlertOpen(true);
          setFormSubmitLoading(false);
        });
    }
  };

  return (
    <>
      {user?.token &&
        isAdmin &&
        (reef.status === "shipped" || reef.status === "deployed") && (
          <ExclusionDatesDialog
            dialogType={reef.status === "shipped" ? "deploy" : "maintain"}
            open={exclusionDatesDialogOpen}
            onClose={() => setExclusionDatesDeployDialogOpen(false)}
            token={user.token}
            timeZone={reef.timezone}
            reefId={reef.id}
          />
        )}
      <Collapse in={alertOpen}>
        <Alert
          severity={alertSeverity}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => {
                setAlertOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alertSeverity === "success"
            ? "Successfully updated site information"
            : "Something went wrong"}
        </Alert>
      </Collapse>
      <Grid
        className={classes.root}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item xs={12}>
          <Grid alignItems="center" container spacing={1}>
            {!editEnabled ? (
              <Grid item className={classes.headerButtonWrapper}>
                <IconButton
                  onClick={clearReefInfo}
                  edge="start"
                  color="primary"
                  aria-label="menu"
                  component={Link}
                  to="/map"
                >
                  <ArrowBack />
                </IconButton>
              </Grid>
            ) : null}

            {editEnabled ? (
              <Grid item xs={12}>
                <EditForm
                  reef={reef}
                  loading={formSubmitLoading}
                  onClose={onCloseForm}
                  onSubmit={handleFormSubmit}
                />
              </Grid>
            ) : (
              <Grid
                className={classes.headerWrapper}
                container
                alignItems="center"
                item
                spacing={1}
              >
                <Grid item xs={12} md={8} container alignItems="center">
                  <Grid item xs={12}>
                    <Grid container alignItems="baseline">
                      <Grid className={classes.reefNameWrapper} item>
                        <Typography variant="h4">
                          {reefName}
                          {reefRegion && `, ${reefRegion}`}
                        </Typography>
                      </Grid>
                      <Grid className={classes.headerButtonWrapper} item>
                        <CollectionButton
                          reefId={reef.id}
                          errorCallback={() => {
                            setAlertOpen(true);
                            setAlertSeverity("error");
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  {organizationName && (
                    <Grid item xs={12}>
                      <Typography variant="h6">{`Managed by ${organizationName}`}</Typography>
                    </Grid>
                  )}
                  {lastSurvey && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">{`Last surveyed: ${displayTimeInLocalTimezone(
                        {
                          isoDate: lastSurvey,
                          format: "MMM DD[,] YYYY",
                          displayTimezone: false,
                          timeZone: reef.timezone,
                        }
                      )}`}</Typography>
                    </Grid>
                  )}
                </Grid>
                {isAdmin && (
                  <Grid
                    container
                    direction={matches ? "row" : "column"}
                    item
                    xs={12}
                    md={4}
                    spacing={1}
                  >
                    <Grid item>
                      <Button
                        className={classes.button}
                        onClick={onOpenForm}
                        size="small"
                        color="primary"
                        variant="outlined"
                      >
                        EDIT SITE DETAILS
                      </Button>
                    </Grid>
                    {reef.sensorId &&
                      (reef.status === "shipped" ||
                        reef.status === "deployed") && (
                        <Grid item>
                          <Button
                            className={classes.button}
                            onClick={() =>
                              setExclusionDatesDeployDialogOpen(true)
                            }
                            size="small"
                            color="primary"
                            variant="outlined"
                          >
                            {reef.status === "shipped"
                              ? "MARK AS DEPLOYED"
                              : "ADD EXCLUSION DATES"}
                          </Button>
                        </Grid>
                      )}
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

const styles = () =>
  createStyles({
    root: {
      marginTop: "2rem",
    },
    managerInfo: {
      marginRight: "0.5rem",
    },
    button: {
      minWidth: 180,
    },
    headerButtonWrapper: {
      width: 48,
    },
    headerWrapper: {
      maxWidth: "calc(100% - 48px)", // maximum width of 100% minus the width of the back button
    },
    reefNameWrapper: {
      maxWidth: "calc(100% - 56px)", // maximum width of 100% minus the width of the collection button and its padding
      overflowWrap: "break-word",
    },
  });

interface ReefNavBarIncomingProps {
  hasDailyData: boolean;
  reef: Reef;
  lastSurvey?: string | null;
  isAdmin: boolean;
}

ReefNavBar.defaultProps = {
  lastSurvey: null,
};

type ReefNavBarProps = ReefNavBarIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(ReefNavBar);
