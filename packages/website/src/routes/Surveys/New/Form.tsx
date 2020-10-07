import React, { useCallback } from "react";
import { Grid, Collapse, IconButton } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useSelector, useDispatch } from "react-redux";
import { SurveyData, SurveyState } from "../../../store/Survey/types";
import {
  surveyErrorSelector,
  surveyAddRequest,
} from "../../../store/Survey/surveySlice";
import { userInfoSelector } from "../../../store/User/userSlice";
import Form from "../../../common/SurveyForm";

const SurveyForm = ({ reefId, changeTab }: SurveyFormProps) => {
  const user = useSelector(userInfoSelector);
  const surveyError = useSelector(surveyErrorSelector);

  const dispatch = useDispatch();

  const onSubmit = useCallback(
    (
      diveDateTime: string,
      diveLocation: SurveyState["diveLocation"],
      weatherConditions: SurveyData["weatherConditions"],
      comments: string
    ) => {
      const surveyData: SurveyData = {
        reef: reefId,
        diveDate: diveDateTime,
        diveLocation,
        weatherConditions,
        comments,
        token: user?.token,
      };
      dispatch(
        surveyAddRequest({
          reefId: `${reefId}`,
          surveyData,
          changeTab,
        })
      );
    },
    [dispatch, changeTab, reefId, user]
  );

  return (
    <>
      <Grid item xs={12}>
        <Collapse in={!!surveyError}>
          <Alert
            severity="error"
            action={
              <IconButton aria-label="close" color="inherit" size="small" />
            }
          >
            There was an error creating the survey.
          </Alert>
        </Collapse>
      </Grid>
      <Form reefId={reefId} onSubmit={onSubmit} />
    </>
  );
};

interface SurveyFormProps {
  changeTab: (index: number) => void;
  reefId: number;
}

export default SurveyForm;
