import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Grid,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Link,
  Box,
  Hidden,
  withStyles,
  WithStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import { sortBy } from "lodash";
import classNames from "classnames";

import RegisterDialog from "../../routes/Homepage/RegisterDialog";
import SignInDialog from "../../routes/Homepage/SignInDialog";
import Search from "../Search";
import MenuDrawer from "../MenuDrawer";
import { userInfoSelector, signOutUser } from "../../store/User/userSlice";

const NavBar = ({ searchLocation, classes }: NavBarProps) => {
  const user = useSelector(userInfoSelector);
  const dispatch = useDispatch();
  const [registerDialogOpen, setRegisterDialogOpen] = useState<boolean>(false);
  const [signInDialogOpen, setSignInDialogOpen] = useState<boolean>(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

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
      <AppBar
        className={classNames(classes.appBar, {
          [classes.appBarXs]: searchLocation,
        })}
        position="static"
        color="primary"
      >
        <Toolbar className={classes.toolbar}>
          <MenuDrawer
            open={menuDrawerOpen}
            onClose={() => setMenuDrawerOpen(false)}
          />
          <Grid
            container
            justify="space-between"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={5} sm={searchLocation ? 6 : 4}>
              <Box display="flex" flexWrap="nowrap" alignItems="center">
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => setMenuDrawerOpen(true)}
                >
                  <MenuIcon />
                </IconButton>

                <Link className={classes.navBarLink} href="/">
                  <Typography color="textPrimary" variant="h4">
                    Aqua
                  </Typography>
                  <Typography style={{ color: "#8AC6DE" }} variant="h4">
                    link
                  </Typography>
                </Link>
              </Box>
            </Grid>

            {searchLocation && (
              <Hidden xsDown>
                <Grid item sm={3}>
                  <Search />
                </Grid>
              </Hidden>
            )}

            <Grid
              container
              justify="flex-end"
              item
              xs={7}
              sm={searchLocation ? 3 : 8}
            >
              {user ? (
                <>
                  <Box display="flex" flexWrap="nowrap" alignItems="center">
                    {user.fullName ? user.fullName : "My Profile"}
                    <IconButton
                      className={classes.button}
                      onClick={handleClick}
                    >
                      <ExpandMoreIcon className={classes.expandIcon} />
                    </IconButton>
                    <Menu
                      key="user-menu"
                      className={classes.userMenu}
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      {sortBy(user.administeredReefs, "id").map(
                        ({ id, name, region }, index) => {
                          const reefIdentifier = name || region;
                          return (
                            <Link href={`/reefs/${id}`} key={`reef-link-${id}`}>
                              <MenuItem className={classes.menuItem}>
                                {reefIdentifier || `Reef ${index + 1}`}
                              </MenuItem>
                            </Link>
                          );
                        }
                      )}
                      <MenuItem
                        key="user-menu-logout"
                        className={classes.menuItem}
                        onClick={() => {
                          dispatch(signOutUser());
                          handleMenuClose();
                        }}
                      >
                        Logout
                      </MenuItem>
                    </Menu>
                  </Box>
                </>
              ) : (
                <>
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
                </>
              )}
            </Grid>

            {searchLocation && (
              <Hidden smUp>
                <Grid item xs={12} style={{ margin: 0, paddingTop: 0 }}>
                  <Search />
                </Grid>
              </Hidden>
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
    navBarLink: {
      display: "flex",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "none",
      },
    },
    appBarXs: {
      [theme.breakpoints.only("xs")]: {
        height: 122,
      },
    },
    toolbar: {
      padding: theme.spacing(0, 1),
    },
    userMenu: {
      marginTop: "3rem",
    },
    menuItem: {
      margin: 0,
      color: theme.palette.text.secondary,
    },
    notificationIcon: {
      color: "#a9e6ff",
    },
    expandIcon: {
      color: "#ffffff",
    },
    button: {
      padding: theme.spacing(1),
      marginLeft: "1rem",
    },
  });

interface NavBarIncomingProps {
  searchLocation: boolean;
}

type NavBarProps = NavBarIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(NavBar);
