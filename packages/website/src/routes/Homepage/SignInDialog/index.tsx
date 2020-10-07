import React, {
  BaseSyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Dialog,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  IconButton,
  TextField,
  Button,
  LinearProgress,
  Collapse,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  resetPassword,
  signInUser,
  userInfoSelector,
  userLoadingSelector,
  userErrorSelector,
} from "../../../store/User/userSlice";
import { UserSignInParams } from "../../../store/User/types";
import incomingStyles from "../styles";

const SignInDialog = ({
  open,
  handleRegisterOpen,
  handleSignInOpen,
  classes,
}: SignInDialogProps) => {
  const dispatch = useDispatch();
  const user = useSelector(userInfoSelector);
  const loading = useSelector(userLoadingSelector);
  const error = useSelector(userErrorSelector);
  const [errorAlertOpen, setErrorAlertOpen] = useState<boolean>(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState<string>("");
  const { register, errors, handleSubmit } = useForm({
    reValidateMode: "onSubmit",
  });

  const onSubmit = useCallback(
    (
      data: any,
      event?: BaseSyntheticEvent<object, HTMLElement, HTMLElement>
    ) => {
      if (event) {
        event.preventDefault();
      }
      const registerInfo: UserSignInParams = {
        email: data.emailAddress,
        password: data.password,
      };
      dispatch(signInUser(registerInfo));
    },
    [dispatch]
  );

  useEffect(() => {
    if (user) {
      handleSignInOpen(false);
    }
    if (error) {
      setErrorAlertOpen(true);
    }
  }, [user, handleSignInOpen, error]);

  const onResetPassword = useCallback(
    (
      data: any,
      event?: BaseSyntheticEvent<object, HTMLElement, HTMLElement>
    ) => {
      if (event) {
        event.preventDefault();
      }
      dispatch(resetPassword({ email: data.emailAddress }));
      setPasswordResetEmail(data.emailAddress);
    },
    [dispatch]
  );

  return (
    <Dialog open={open} maxWidth="md">
      <Card>
        <CardHeader
          className={classes.dialogHeader}
          title={
            <Grid container justify="center" item xs={12}>
              <Grid
                container
                alignItems="center"
                justify="space-around"
                item
                xs={12}
              >
                <Grid container item xs={6}>
                  <Typography variant="h4">Aqua</Typography>
                  <Typography
                    className={classes.dialogHeaderSecondPart}
                    variant="h4"
                  >
                    link
                  </Typography>
                </Grid>
                <Grid container justify="flex-end" item xs={1}>
                  <IconButton
                    className={classes.closeButton}
                    size="small"
                    onClick={() => handleSignInOpen(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          }
        />
        {loading && <LinearProgress />}
        {error && (
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
              {error}
            </Alert>
          </Collapse>
        )}
        <Collapse in={passwordResetEmail !== ""}>
          <Alert
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setPasswordResetEmail("");
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {`Password reset email sent to ${passwordResetEmail}.`}
          </Alert>
        </Collapse>
        <CardContent>
          <Grid container justify="center" item xs={12}>
            <Grid className={classes.dialogContentTitle} container item xs={10}>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  Sign In
                </Typography>
              </Grid>
            </Grid>
            <Grid container item xs={10}>
              <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <Grid className={classes.textFieldWrapper} item xs={12}>
                  <Typography className={classes.formText} variant="subtitle2">
                    or login with email address
                  </Typography>
                  <TextField
                    id="emailAddress"
                    name="emailAddress"
                    placeholder="Email Address"
                    helperText={
                      errors.emailAddress ? errors.emailAddress.message : ""
                    }
                    label="Email Address"
                    inputRef={register({
                      required: "This is a required field",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    error={!!errors.emailAddress}
                    inputProps={{ className: classes.textField }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid className={classes.textFieldWrapper} item xs={12}>
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    helperText={errors.password ? errors.password.message : ""}
                    label="Password"
                    inputRef={register({
                      required: "This is a required field",
                    })}
                    error={!!errors.password}
                    inputProps={{ className: classes.textField }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid container item xs={12}>
                  <Button
                    className={classes.forgotPasswordButton}
                    onClick={handleSubmit(onResetPassword)}
                  >
                    <Typography variant="subtitle2" color="textSecondary">
                      Forgot your password?
                    </Typography>
                  </Button>
                </Grid>
                <Grid className={classes.button} item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    color="primary"
                    variant="contained"
                    size="large"
                  >
                    SIGN IN
                  </Button>
                </Grid>
                <Grid container item xs={12}>
                  <Typography
                    className={classes.formText}
                    variant="subtitle1"
                    color="textSecondary"
                  >
                    Don&#39;t have an account?{" "}
                    <Button
                      onClick={() => {
                        handleRegisterOpen(true);
                        handleSignInOpen(false);
                      }}
                      color="primary"
                    >
                      REGISTER
                    </Button>
                  </Typography>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Dialog>
  );
};

const styles = () =>
  createStyles({
    ...incomingStyles,
    formText: {
      ...incomingStyles.formText,
      marginBottom: "1rem",
    },
    forgotPasswordButton: {
      color: "inherit",
      textDecoration: "none",
    },
  });

interface SignInDialogIncomingProps {
  open: boolean;
  handleRegisterOpen: (open: boolean) => void;
  handleSignInOpen: (open: boolean) => void;
}

type SignInDialogProps = SignInDialogIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(SignInDialog);
