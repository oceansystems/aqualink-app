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
  useTheme,
  useMediaQuery,
  Divider,
} from "@material-ui/core";
import DashboardTwoToneIcon from "@material-ui/icons/DashboardTwoTone";
import MenuIcon from "@material-ui/icons/Menu";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { sortBy } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";

import RegisterDialog from "../RegisterDialog";
import SignInDialog from "../SignInDialog";
import Search from "../Search";
import RouteButtons from "../RouteButtons";
import MenuDrawer from "../MenuDrawer";
import { userInfoSelector, signOutUser } from "../../store/User/userSlice";
import {
  clearCollection,
  collectionDetailsSelector,
} from "../../store/Collection/collectionSlice";

const NavBar = ({
  searchLocation,
  geocodingEnabled,
  routeButtons,
  classes,
}: NavBarProps) => {
  const user = useSelector(userInfoSelector);
  const storedCollection = useSelector(collectionDetailsSelector);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up("md"));
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

  const onUserSignOut = () => {
    // Clear collection if it belongs to the signed in user
    if (storedCollection?.id === user?.collection?.id) {
      dispatch(clearCollection());
    }
    dispatch(signOutUser());
    handleMenuClose();
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
            <Grid
              item
              xs={5}
              sm={2}
              // eslint-disable-next-line no-nested-ternary
              md={routeButtons ? 2 : searchLocation ? 6 : 4}
            >
              <Box display="flex" flexWrap="nowrap" alignItems="center">
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => setMenuDrawerOpen(true)}
                >
                  <MenuIcon />
                </IconButton>

                <Link className={classes.navBarLink} href="/map">
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
                <Grid item sm={4} md={3}>
                  <Search geocodingEnabled={geocodingEnabled} />
                </Grid>
              </Hidden>
            )}

            {routeButtons && isTablet && <RouteButtons />}

            <Grid
              container
              justify="flex-end"
              item
              xs={7}
              sm={routeButtons && isTablet ? 3 : 4}
              md={searchLocation || (routeButtons && isTablet) ? 3 : 8}
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
                      MenuListProps={{ className: classes.userMenu }}
                      PopoverClasses={{ paper: classes.userMenuWrapper }}
                    >
                      {sortBy(user.administeredReefs, "id").map(
                        ({ id, name, region }, index) => {
                          const reefIdentifier = name || region;
                          return (
                            <Link
                              underline="none"
                              href={`/reefs/${id}`}
                              key={`reef-link-${id}`}
                              className={classes.menuItemLink}
                            >
                              <MenuItem className={classes.menuItem}>
                                {reefIdentifier || `Reef ${index + 1}`}
                              </MenuItem>
                            </Link>
                          );
                        }
                      )}
                      <Divider className={classes.userMenuDivider} />
                      <Link href="/dashboard" className={classes.menuItemLink}>
                        <MenuItem
                          key="user-menu-dashboard"
                          className={classes.menuItem}
                        >
                          <Grid container spacing={1}>
                            <Grid item>
                              <DashboardTwoToneIcon fontSize="small" />
                            </Grid>
                            <Grid item>Dashboard</Grid>
                          </Grid>
                        </MenuItem>
                      </Link>
                      <Divider className={classes.userMenuDivider} />
                      <MenuItem
                        key="user-menu-logout"
                        className={classes.menuItem}
                        onClick={onUserSignOut}
                      >
                        <Grid container spacing={1}>
                          <Grid item>
                            <PowerSettingsNewIcon fontSize="small" />
                          </Grid>
                          <Grid item>Logout</Grid>
                        </Grid>
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
                      SIGN UP
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>

            {searchLocation && (
              <Hidden smUp>
                <Grid item xs={12} style={{ margin: 0, paddingTop: 0 }}>
                  <Search geocodingEnabled={geocodingEnabled} />
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
    userMenuWrapper: {
      marginTop: 36,
      border: "1px solid rgba(0, 0, 0, 0.12)",
      maxWidth: 275,
    },
    userMenuDivider: {
      margin: "4px 0",
    },
    userMenu: {
      padding: "4px 0",
    },
    menuItem: {
      margin: 0,
      color: theme.palette.text.secondary,
      fontSize: 14,
      display: "block",
      overflowWrap: "break-word",
      whiteSpace: "unset",
      "&:hover": {
        backgroundColor: "rgba(22, 141, 189, 0.8)",
        color: theme.palette.text.primary,
      },
      minHeight: "auto",
    },
    menuItemLink: {
      textDecoration: "none",
      "&:hover": {
        textDecoration: "none",
      },
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
  geocodingEnabled?: boolean;
  routeButtons?: boolean;
}

NavBar.defaultProps = {
  geocodingEnabled: false,
  routeButtons: false,
};

type NavBarProps = NavBarIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(NavBar);
