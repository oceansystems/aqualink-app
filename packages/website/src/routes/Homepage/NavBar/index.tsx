import React, { useState, ChangeEvent } from "react";
import {
  AppBar,
  Toolbar,
  Grid,
  IconButton,
  Typography,
  InputBase,
  Avatar,
  Button,
  Menu,
  MenuItem,
  withStyles,
  WithStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useSelector, useDispatch } from "react-redux";

import RegisterDialog from "../RegisterDialog";
import SignInDialog from "../SignInDialog";
import { userInfoSelector, signOutUser } from "../../../store/User/userSlice";

const HomepageNavBar = ({ classes }: HomepageNavBarProps) => {
  const user = useSelector(userInfoSelector);
  const dispatch = useDispatch();
  const [searchLocationText, setSearchLocationText] = useState<string>("");
  const [registerDialogOpen, setRegisterDialogOpen] = useState<boolean>(false);
  const [signInDialogOpen, setSignInDialogOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const onChangeSearchText = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setSearchLocationText(event.target.value);
  };

  // TODO: Dispatch action to search for reefs based on value
  const onSearchSubmit = () => {
    // eslint-disable-next-line no-console
    console.log(searchLocationText);
  };

  const handleRegisterDialog = (open: boolean) => setRegisterDialogOpen(open);
  const handleSignInDialog = (open: boolean) => setSignInDialogOpen(open);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar className={classes.appBar} position="static" color="primary">
        <Toolbar>
          <Grid container alignItems="center" item xs={12}>
            <Grid item xs={1}>
              <IconButton edge="start" color="inherit">
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid container item xs={5}>
              <Typography variant="h4">Aqua</Typography>
              <Typography style={{ color: "#8AC6DE" }} variant="h4">
                link
              </Typography>
            </Grid>
            {user ? (
              <>
                <Grid container justify="flex-end" item xs={3}>
                  <Grid
                    className={classes.searchBar}
                    container
                    alignItems="center"
                    item
                    xs={8}
                  >
                    <Grid
                      className={classes.searchBarIcon}
                      item
                      xs={2}
                      container
                      alignItems="center"
                      justify="center"
                    >
                      <IconButton size="small" onClick={onSearchSubmit}>
                        <SearchIcon />
                      </IconButton>
                    </Grid>
                    <Grid
                      className={classes.searchBarText}
                      item
                      xs={10}
                      container
                      alignItems="center"
                    >
                      <InputBase
                        value={searchLocationText}
                        onChange={onChangeSearchText}
                        placeholder="Search location"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container justify="flex-end" item xs={3}>
                  <IconButton>
                    <NotificationsIcon />
                  </IconButton>
                  <IconButton>
                    <Avatar />
                  </IconButton>
                  <IconButton onClick={handleClick}>
                    <ExpandMoreIcon />
                  </IconButton>
                  <Menu
                    key="user-menu"
                    className={classes.userMenu}
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem
                      className={classes.menuItem}
                      onClick={() => {
                        dispatch(signOutUser());
                        handleMenuClose();
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </Grid>
              </>
            ) : (
              <Grid container justify="flex-end" item xs={6}>
                <Grid item>
                  <Button onClick={() => handleSignInDialog(true)}>
                    SIGN IN
                  </Button>
                </Grid>
                <Grid item>
                  <Button onClick={() => handleRegisterDialog(true)}>
                    REGISTER
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
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
    appBar: {
      height: 64,
      "&.MuiPaper-root": {
        backgroundColor: theme.palette.primary.main,
      },
    },
    searchBar: {
      height: 42,
    },
    searchBarIcon: {
      backgroundColor: "#6ba8c0",
      borderRadius: "4px 0 0 4px",
      height: "100%",
    },
    searchBarText: {
      paddingLeft: "0.5rem",
      backgroundColor: "#469abb",
      borderRadius: "0 4px 4px 0",
      height: "100%",
    },
    userMenu: {
      marginTop: "3rem",
    },
    menuItem: {
      margin: 0,
      backgroundColor: theme.palette.grey[500],
      color: theme.palette.text.secondary,
    },
  });

type HomepageNavBarProps = WithStyles<typeof styles>;

export default withStyles(styles)(HomepageNavBar);
