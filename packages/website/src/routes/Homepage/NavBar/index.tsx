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
  withStyles,
  WithStyles,
  createStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const HomepageNavBar = ({ classes }: HomepageNavBarProps) => {
  const [searchLocationText, setSearchLocationText] = useState<string>("");
  const [signedIn, setSignedIn] = useState<boolean>(false);

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

  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar>
        <Grid container alignItems="center" item xs={12}>
          <Grid item xs={1}>
            <IconButton edge="start" color="inherit">
              <MenuIcon />
            </IconButton>
          </Grid>
          <Grid container item xs={5}>
            <Typography variant="h4">Aqua</Typography>
            <Typography style={{ fontWeight: 300 }} variant="h4">
              link
            </Typography>
          </Grid>
          {signedIn ? (
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
                <IconButton>
                  <ExpandMoreIcon />
                </IconButton>
              </Grid>
            </>
          ) : (
            <Grid container justify="flex-end" item xs={6}>
              <Grid item>
                <Button onClick={() => setSignedIn(true)}>SIGN IN</Button>
              </Grid>
              <Grid item>
                <Button>REGISTER</Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

const styles = () =>
  createStyles({
    appBar: {
      height: 64,
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
  });

interface HomepageNavBarProps extends WithStyles<typeof styles> {}

export default withStyles(styles)(HomepageNavBar);
