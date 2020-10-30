import React from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Container,
  Grid,
  Typography,
  Box,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import NavBar from "../../common/NavBar";
import Card from "./Card";
import landingPageImage from "../../assets/img/landing-page-image.jpg";
import { cardTitles } from "./titles";

const LandingPage = ({ classes }: LandingPageProps) => {
  return (
    <>
      <NavBar routeButtons searchLocation={false} />
      <div className={classes.landingImage}>
        <div className={classes.layer}>
          <Container>
            <Grid container item xs={9}>
              <Box display="flex">
                <Typography variant="h1" color="textPrimary">
                  Aqua
                </Typography>
                <Typography
                  className={classes.aqualinkSecondPart}
                  color="textPrimary"
                  variant="h1"
                >
                  link
                </Typography>
              </Box>
            </Grid>
            <Grid container item sm={11} md={7}>
              <Box mt="1.5rem" display="flex">
                <Typography variant="h1" color="textPrimary">
                  Temperature monitoring for marine ecosystems
                </Typography>
              </Box>
            </Grid>
            <Grid container item sm={9} md={4}>
              <Box mt="4rem" display="flex">
                <Typography variant="h4" color="textPrimary">
                  A free tools for people on the front line of Ocean
                  conservation
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box mt="2rem">
                <Grid container spacing={3}>
                  <Grid item>
                    <Button
                      component={Link}
                      to="/map"
                      className={classes.buttons}
                      variant="contained"
                      color="primary"
                    >
                      <Typography variant="h5">View The Map</Typography>
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      component={Link}
                      to="/register"
                      className={`${classes.buttons} ${classes.registerButton}`}
                      variant="outlined"
                      color="primary"
                    >
                      <Typography variant="h5">Register Your Site</Typography>
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Container>
        </div>
      </div>
      <Container>
        {cardTitles.map((item) => (
          <Card
            key={item.title}
            title={item.title}
            text={item.text}
            backgroundColor={item.backgroundColor}
            direction={item.direction}
            image={item.image}
          />
        ))}
      </Container>
    </>
  );
};

const styles = () =>
  createStyles({
    landingImage: {
      backgroundImage: `url("${landingPageImage}")`,
      left: "10rem",
      backgroundSize: "cover",
      height: "54rem",
    },
    layer: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      width: "100%",
      height: "100%",
      alignItems: "center",
      display: "flex",
    },
    aqualinkSecondPart: {
      opacity: 0.5,
    },
    buttons: {
      height: "3rem",
      width: "12rem",
      textTransform: "none",
    },
    registerButton: {
      color: "#ffffff",
      border: "2px solid #ffffff",
      "&:hover": {
        color: "#ffffff",
        border: "2px solid #ffffff",
      },
    },
  });

type LandingPageProps = WithStyles<typeof styles>;

export default withStyles(styles)(LandingPage);
