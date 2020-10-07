import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  withStyles,
  WithStyles,
  createStyles,
  IconButton,
  Collapse,
  LinearProgress,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import CloseIcon from "@material-ui/icons/Close";
import moment from "moment";

import surveyServices from "../../../../../services/surveyServices";
import { userInfoSelector } from "../../../../../store/User/userSlice";
import { surveysRequest } from "../../../../../store/Survey/surveyListSlice";
import DeleteDialog, { Action } from "../../../../../common/Dialog";

const DeleteButton = ({
  reefId,
  surveyId,
  diveDate,
  classes,
}: DeleteButtonProps) => {
  const user = useSelector(userInfoSelector);
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAlertOpen(false);
    setAlertText("");
  };

  const onSurveyDelete = () => {
    if (surveyId && user && user.token) {
      setLoading(true);
      surveyServices
        .deleteSurvey(reefId, surveyId, user.token)
        .then(() => {
          dispatch(surveysRequest(`${reefId}`));
        })
        .catch((error) => {
          setAlertOpen(true);
          setAlertText(error.message);
        })
        .finally(() => setLoading(false));
    }
  };

  const dialogActions: Action[] = [
    {
      size: "small",
      variant: "contained",
      color: "secondary",
      text: "No",
      action: handleClose,
    },
    {
      size: "small",
      variant: "contained",
      color: "primary",
      text: "Yes",
      action: onSurveyDelete,
    },
  ];

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <DeleteOutlineIcon color="primary" />
      </IconButton>
      <DeleteDialog
        open={open}
        onClose={handleClose}
        header={`Are you sure you would like to delete the survey for ${moment(
          diveDate
        ).format(
          "MM/DD/YYYY"
        )}? It will delete all media assosciated with this survey.`}
        content={
          <>
            {loading && <LinearProgress />}
            <Collapse className={classes.alert} in={alertOpen}>
              <Alert
                severity="error"
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
                {alertText}
              </Alert>
            </Collapse>
          </>
        }
        actions={dialogActions}
      />
    </>
  );
};

const styles = () =>
  createStyles({
    alert: {
      width: "100%",
    },
  });

interface DeleteButtonIncomingProps {
  surveyId?: number | null;
  diveDate?: string | null;
  reefId: number;
}

DeleteButton.defaultProps = {
  surveyId: null,
  diveDate: null,
};

type DeleteButtonProps = DeleteButtonIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(DeleteButton);
