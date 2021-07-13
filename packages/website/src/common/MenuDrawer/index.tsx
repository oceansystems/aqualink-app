import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
  createStyles,
  Drawer,
  IconButton,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { Clear, GitHub } from "@material-ui/icons";
import ovioLogo from "../../assets/img/ovio_logo.png";

const menuRoutes = [
  {
    text: "HOME",
    to: "/",
  },
  {
    text: "MAP",
    to: "/map",
  },
  {
    text: "BUOY",
    to: "/buoy",
  },
  {
    text: "DRONE",
    to: "/drones",
  },
  {
    text: "ABOUT",
    to: "/about",
  },
  {
    text: "FAQ",
    to: "/faq",
  },
  {
    text: "TRACK A HEATWAVE",
    to: "/tracker",
  },
  {
    text: "REGISTER A SITE",
    to: "/register",
  },
];

const MenuDrawer = ({ classes, open, onClose }: MenuDrawerProps) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <IconButton
        onClick={onClose}
        style={{
          alignSelf: "flex-end",
          marginRight: 5,
          marginTop: 5,
          color: "white",
        }}
      >
        <Clear />
      </IconButton>
      {menuRoutes.map(({ text, to }) => (
        <Button
          className={classes.menuDrawerButton}
          key={text}
          component={Link}
          to={to}
        >
          <Typography variant="h6">{text}</Typography>
        </Button>
      ))}
      <Box marginTop="auto" padding="25px">
        <Typography variant="subtitle1">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Aqualink's source code is licenced under MIT. Contribute!
        </Typography>
        <ButtonGroup variant="contained" color="default">
          <Button
            target="_blank"
            href="https://github.com/aqualinkorg/aqualink-app"
            startIcon={<GitHub />}
            className={classes.contributeButton}
          >
            GitHub
          </Button>

          <Button
            target="_blank"
            href="https://ovio.org/project/aqualinkorg/aqualink-app"
            className={classes.contributeButton}
          >
            <img src={ovioLogo} alt="Ovio Logo" />
          </Button>
        </ButtonGroup>
      </Box>
    </Drawer>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      width: "16rem",
      alignItems: "center",
      // paddingTop: "2rem",
      backgroundColor: "#095877",
    },
    contributeButton: {
      width: "50%",
      textTransform: "none",
      "& img": {
        maxWidth: "100%",
      },
      "&:hover": {
        color: "#000000",
      },
    },
    menuDrawerButton: {
      margin: theme.spacing(2, 4, 4),
      "&:hover": {
        color: "white",
      },
    },
  });

interface MenuDrawerIncomingProps {
  open: boolean;
  onClose: any;
}

type MenuDrawerProps = MenuDrawerIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(MenuDrawer);
