import React, { useState, ReactNode, useEffect } from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Grid,
  Typography,
  Container,
  Box,
  Theme,
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";

import type { Reef } from "../../../store/Reefs/types";
import Map from "./Map";
import Form from "./Form";
import UploadMedia from "./UploadMedia";

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div style={{ overflow: "hidden" }}>
      <Container hidden={value !== index} {...other}>
        {value === index && <div>{children}</div>}
      </Container>
    </div>
  );
};

const NewSurvey = ({ reef, classes }: NewSurveyProps) => {
  const [value, setValue] = useState<number>(0);

  const onPanelIndexChange = (index: number) => {
    setValue(index);
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <Box flexGrow={1}>
      <SwipeableViews index={value} axis="x">
        <TabPanel value={value} index={0}>
          <Grid className={classes.root} container justify="center">
            <Grid item xs={10}>
              {reef.name && (
                <Typography variant="h5">{`NEW SURVEY FOR ${reef.name.toUpperCase()}`}</Typography>
              )}
            </Grid>
            <Grid
              style={{ marginTop: "2rem" }}
              container
              justify="space-between"
              item
              xs={10}
            >
              <Grid item xs={12}>
                <Typography
                  style={{ fontWeight: "normal", marginBottom: "0.5rem" }}
                  variant="h6"
                >
                  Select your survey location by clicking on the map.
                </Typography>
              </Grid>
              <Grid className={classes.mapContainer} item xs={12} lg={6}>
                <Map polygon={reef.polygon} />
              </Grid>
              <Grid item xs={12} lg={5}>
                <Form reefId={reef.id} changeTab={onPanelIndexChange} />
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <UploadMedia
            reefName={reef.name}
            reefId={reef.id}
            changeTab={onPanelIndexChange}
          />
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginTop: "2rem",
      // overflow: "hidden",
    },
    mapContainer: {
      height: "30rem",
      [theme.breakpoints.down("lg")]: {
        marginBottom: "3rem",
      },
      [theme.breakpoints.down("xs")]: {
        height: "15rem",
      },
    },
  });

interface NewSurveyIncomingProps {
  reef: Reef;
}

interface TabPanelProps {
  children: ReactNode;
  index: any;
  value: any;
}

type NewSurveyProps = NewSurveyIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(NewSurvey);
