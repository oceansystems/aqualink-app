import React from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Theme,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ReactPlayer from "react-player";

import reefImage from "../../../../assets/reef-image.jpg";
import uploadIcon from "../../../../assets/icon_upload.svg";

const FeatureVideo = ({ url, classes }: FeatureVideoProps) => {
  return (
    <Card className={classes.card}>
      {url ? (
        <CardContent className={classes.content}>
          <ReactPlayer
            height="100%"
            width="100%"
            playing
            muted
            light
            url={`${url}`}
          />
        </CardContent>
      ) : (
        <div className={classes.noVideoCard}>
          <div className={classes.noVideoCardHeader}>
            <Grid container item spacing={2}>
              <Grid container justify="center" item xs={12}>
                <Typography style={{ opacity: 0.5 }} variant="h5">
                  VIDEO TO BE UPLOADED
                </Typography>
              </Grid>
              <Grid container justify="center" item xs={12}>
                <IconButton>
                  <img src={uploadIcon} alt="upload" />
                </IconButton>
              </Grid>
            </Grid>
          </div>
          <div className={classes.noVideoCardContent} />
          <IconButton className={classes.playIconWrapper}>
            <PlayArrowIcon className={classes.playIcon} />
          </IconButton>
        </div>
      )}
    </Card>
  );
};

const styles = (theme: Theme) => {
  return createStyles({
    card: {
      height: "100%",
      width: "100%",
      display: "flex",
    },
    content: {
      height: "100%",
      width: "100%",
      padding: "0",
    },
    noVideoCard: {
      position: "relative",
      height: "100%",
      width: "100%",
    },
    noVideoCardHeader: {
      backgroundColor: "#033042",
      opacity: 0.75,
      position: "absolute",
      top: 0,
      width: "100%",
      padding: "2rem 0 1rem",
      zIndex: 1,
    },
    noVideoCardContent: {
      width: "100%",
      height: "100%",
      backgroundImage: `url(${reefImage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      filter: "blur(2px)",
    },
    playIconWrapper: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, 0)",
    },
    playIcon: {
      opacity: 0.5,
      color: theme.palette.primary.light,
      fontSize: "8rem",
    },
  });
};

interface FeatureVideoIncomingProps {
  url: string | null;
}

type FeatureVideoProps = WithStyles<typeof styles> & FeatureVideoIncomingProps;

export default withStyles(styles)(FeatureVideo);
