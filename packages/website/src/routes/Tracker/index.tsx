import React from "react";
import {
  Box,
  Card,
  CardMedia,
  Container,
  Grid,
  Typography,
  withStyles,
  WithStyles,
  createStyles,
  Theme,
} from "@material-ui/core";

import NavBar from "../../common/NavBar";
import Footer from "../../common/Footer";
import image1 from "../../assets/img/tracker-page/image1.png";
import image2 from "../../assets/img/tracker-page/image2.png";
import footprint from "../../assets/img/tracker-page/footprint.png";

const Tracker = ({ classes }: TrackerProps) => {
  return (
    <>
      <NavBar searchLocation={false} />
      <Container className={classes.root}>
        <Box margin="48px 0">
          <Typography className={classes.title} variant="h2">
            Tracking Heatwaves
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5} lg={4}>
            <Typography variant="h6">
              The ability for sensors to be grouped for a particular event, such
              as a Heatwave, or a particular region, is important for users to
              get critical information at a glance. We have launched a new
              feature called Dashboards where anyone can create a customized
              collection of sensors to track this information. For example, the
              <a
                className={classes.link}
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.minderoo.org/"
              >
                {" "}
                Minderoo Foundation
              </a>{" "}
              worked with us and the{" "}
              <a
                className={classes.link}
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.uwa.edu.au"
              >
                University of Western Australila
              </a>{" "}
              to deploy Smart Buoys along the Western coast of Australia. This
              was done in a critical time for the region where an extreme
              heatwave, known as the{" "}
              <a
                className={classes.link}
                rel="noopener noreferrer"
                target="_blank"
                href="https://en.wikipedia.org/wiki/La_Ni%C3%B1a"
              >
                La Nina
              </a>
              , was exptected to come through the area, potentially bringing
              devastating affects to the local ecosystems. They created a
              dashboard{" "}
              <a className={classes.link} href="/collections/minderoo">
                here
              </a>{" "}
              that aggregrates all the sensors involved in tracking this event
              to get a real-time view of the severity. Scientists, media, and
              the general public can use this feature to get a holistic view of
              regional and event-based information, and we hope to enable a
              better understanding of how to protect the ecosystems during such
              times as the La Nina Heatwave.
            </Typography>
          </Grid>
          <Grid item xs={12} md={7} lg={8}>
            <Card className={classes.card1} variant="outlined">
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="/collections/minderoo"
              >
                <CardMedia className={classes.image} image={image1} />
              </a>
            </Card>
          </Grid>
        </Grid>
        <Box margin="72px 0 48px 0">
          <Typography className={classes.title} variant="h2">
            Create Your Dashboard
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7} lg={8}>
            <Card className={classes.card2} variant="outlined">
              <CardMedia className={classes.image} image={image2} />
            </Card>
          </Grid>
          <Grid item xs={12} md={5} lg={4}>
            <Typography variant="h6">
              To get started, head over to one of the sites you are interested
              in adding to your Dashboard. A bookmark icon will appear next to
              the site name in the heading. Clicking this will add the site. To
              remove it, simply click the bookmark icon again. Your dashboard
              page will aggregate all the sites that you add this way, and the
              name of the collection can be customized to reflect the region,
              event, or other interest.
            </Typography>
          </Grid>
        </Grid>
        <Box margin="48px 0 72px 0">
          <Grid
            container
            justify="space-between"
            alignItems="center"
            spacing={3}
          >
            <Grid item xs={12} md={7} lg={9}>
              <Typography variant="h6">
                We worked closely with the Minderoo Foundation to build this
                feature. The funding for the Heatwave Tracker development was
                provided by the FootPrint Coalition and we would like to thank
                them for their support.
              </Typography>
            </Grid>
            <Grid item xs={12} md={3} lg={2}>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.footprintcoalition.com/"
              >
                <img src={footprint} alt="footprint" />
              </a>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      fontWeight: 400,
      fontSize: 36,
    },
    card1: {
      width: "100%",
      paddingTop: "calc(100% / 1.29)",
      position: "relative",
      borderRadius: 10,
    },
    card2: {
      width: "100%",
      paddingTop: "calc(100% / 2.03)",
      position: "relative",
      borderRadius: 10,
    },
    image: {
      height: "100%",
      width: "100%",
      position: "absolute",
      top: 0,
      left: 0,
    },
    link: {
      color: theme.palette.primary.main,
      "&:hover": {
        color: theme.palette.primary.main,
        textDecoration: "none",
      },
    },
  });

type TrackerProps = WithStyles<typeof styles>;

export default withStyles(styles)(Tracker);
