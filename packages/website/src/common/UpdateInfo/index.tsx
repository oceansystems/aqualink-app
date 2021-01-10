import React from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Grid,
  Box,
  Typography,
} from "@material-ui/core";
import UpdateIcon from "@material-ui/icons/Update";
import { Link } from "react-router-dom";

const UpdateInfo = ({
  timestamp,
  timestampText,
  image,
  imageText,
  live,
  frequency,
  href,
  classes,
}: UpdateInfoProps) => (
  <Grid
    className={classes.updateInfo}
    container
    justify="space-around"
    alignItems="center"
    item
  >
    <Grid item>
      <Grid container alignItems="center" justify="center">
        <Grid item>
          <UpdateIcon className={classes.updateIcon} fontSize="small" />
        </Grid>
        <Grid className={classes.updateTimeInfo} item>
          <Box display="flex" flexDirection="column">
            <Typography variant="caption">
              {timestampText} {timestamp}
            </Typography>
            <Typography variant="caption">Updated {frequency}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>
    <Grid className={classes.nooaChip} item>
      <Grid container alignItems="center" justify="center">
        {live ? (
          <>
            <div className={classes.circle} />
            <Typography className={classes.nooaChipText}>LIVE</Typography>
          </>
        ) : (
          <Link
            to={{ pathname: href }}
            target="_blank"
            className={classes.nooaLink}
          >
            <Typography className={classes.nooaChipText}>
              {imageText}
            </Typography>
            {image && (
              <img
                className={classes.sensorImage}
                alt="sensor-type"
                src={image}
              />
            )}
          </Link>
        )}
      </Grid>
    </Grid>
  </Grid>
);

const styles = () =>
  createStyles({
    updateInfo: {
      backgroundColor: "#c4c4c4",
      color: "#757575",
      padding: "2px 0",
    },
    updateIcon: {
      marginRight: 4,
      height: "1.5rem",
      width: "1.5rem",
    },
    updateTimeInfo: {
      width: 215,
    },
    nooaChip: {
      backgroundColor: "#dddddd",
      borderRadius: 8,
      height: 24,
      width: 48,
      display: "flex",
    },
    nooaLink: {
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      color: "inherit",
      "&:hover": {
        textDecoration: "none",
        color: "inherit",
      },
    },
    nooaChipText: {
      fontSize: 8.4,
    },
    sensorImage: {
      height: 18,
      width: 18,
    },
    circle: {
      backgroundColor: "#51DD00",
      borderRadius: "50%",
      height: 8.4,
      width: 8.4,
      marginRight: 5,
    },
  });

interface UpdateInfoIncomingProps {
  timestamp: string | null;
  timestampText: string;
  image: string | null;
  imageText: string | null;
  live: boolean;
  frequency: "hourly" | "daily";
  href?: string;
}

UpdateInfo.defaultProps = {
  href: "",
};

type UpdateInfoProps = UpdateInfoIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(UpdateInfo);