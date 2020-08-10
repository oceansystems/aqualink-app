import React, {
  BaseSyntheticEvent,
  useCallback,
  useState,
  useEffect,
} from "react";
import { Link } from "react-router-dom";
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme,
  Dialog,
  Card,
  CardHeader,
  IconButton,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Checkbox,
  LinearProgress,
  Collapse,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  createUser,
  userInfoSelector,
  userLoadingSelector,
  userErrorSelector,
} from "../../../store/User/userSlice";
import { UserRegisterParams } from "../../../store/User/types";

const RegisterDialog = ({
  open,
  handleRegisterOpen,
  handleSignInOpen,
  classes,
}: RegisterDialogProps) => {
  const dispatch = useDispatch();
  const user = useSelector(userInfoSelector);
  const loading = useSelector(userLoadingSelector);
  const error = useSelector(userErrorSelector);
  const [errorAlertOpen, setErrorAlertOpen] = useState<boolean>(false);
  const [readTerms, setReadTerms] = useState<boolean>(false);

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
      const registerInfo: UserRegisterParams = {
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.emailAddress,
        password: data.password,
      };
      dispatch(createUser(registerInfo));
    },
    [dispatch]
  );

  useEffect(() => {
    if (user) {
      handleRegisterOpen(false);
    }
    if (error) {
      setErrorAlertOpen(true);
    }
  }, [user, handleRegisterOpen, error]);

  return (
    <Dialog open={open}>
      <Card className={classes.root}>
        <CardHeader
          className={classes.dialogHeader}
          title={
            <Grid container justify="flex-end" item xs={12}>
              <Grid
                container
                alignItems="center"
                justify="space-between"
                item
                xs={11}
              >
                <Grid container item xs={4}>
                  <Typography variant="h4">Aqua</Typography>
                  <Typography style={{ color: "#8AC6DE" }} variant="h4">
                    link
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    className={classes.closeButton}
                    size="small"
                    onClick={() => handleRegisterOpen(false)}
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
        <CardContent>
          <Grid container justify="center" item xs={12}>
            <Grid style={{ margin: "1rem 0 1rem 0" }} container item xs={10}>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  Create an account
                </Typography>
              </Grid>
            </Grid>
            <Grid container item xs={10}>
              <form
                className={classes.registerForm}
                onSubmit={handleSubmit(onSubmit)}
              >
                <Grid className={classes.textFieldWrapper} item xs={12}>
                  <TextField
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    helperText={
                      errors.firstName ? errors.firstName.message : ""
                    }
                    label="First Name"
                    inputRef={register({
                      required: "This is a required field",
                    })}
                    error={!!errors.firstName}
                    inputProps={{ className: classes.textField }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid className={classes.textFieldWrapper} item xs={12}>
                  <TextField
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    helperText={errors.lastName ? errors.lastName.message : ""}
                    label="Last Name"
                    inputRef={register({
                      required: "This is a required field",
                    })}
                    error={!!errors.lastName}
                    inputProps={{ className: classes.textField }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid className={classes.textFieldWrapper} item xs={12}>
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
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    error={!!errors.password}
                    inputProps={{ className: classes.textField }}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid container item xs={12}>
                  <Checkbox
                    className={classes.termsCheckbox}
                    checked={readTerms}
                    onChange={() => setReadTerms(!readTerms)}
                    color="primary"
                  />
                  <Typography
                    className={classes.termsText}
                    variant="subtitle1"
                    color="textSecondary"
                  >
                    I have read the{" "}
                    <Link style={{ color: "black" }} to="/">
                      Terms and Conditions
                    </Link>
                  </Typography>
                </Grid>
                <Grid className={classes.button} item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    color="primary"
                    variant="contained"
                    size="large"
                    disabled={!readTerms}
                  >
                    REGISTER NOW
                  </Button>
                </Grid>
                <Grid container item xs={12}>
                  <Typography
                    className={classes.termsText}
                    variant="subtitle1"
                    color="textSecondary"
                  >
                    Have an account?{" "}
                    <Button
                      onClick={() => {
                        handleRegisterOpen(false);
                        handleSignInOpen(true);
                      }}
                      color="primary"
                    >
                      SIGN IN
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

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: "72vh",
      width: "30vw",
    },
    closeButton: {
      color: theme.palette.primary.light,
    },
    dialogHeader: {
      backgroundColor: theme.palette.primary.main,
    },
    registerForm: {
      width: "100%",
    },
    textFieldWrapper: {
      margin: "1rem 0 1rem 0",
    },
    textField: {
      color: "black",
    },
    termsCheckbox: {
      padding: 0,
      margin: "0 0 1rem 0",
    },
    termsText: {
      color: theme.palette.grey[500],
      fontWeight: 400,
    },
    button: {
      marginBottom: "1rem",
    },
  });

interface RegisterDialogIncomingProps {
  open: boolean;
  handleRegisterOpen: (open: boolean) => void;
  handleSignInOpen: (open: boolean) => void;
}

type RegisterDialogProps = RegisterDialogIncomingProps &
  WithStyles<typeof styles>;

export default withStyles(styles)(RegisterDialog);
