import React from "react";
import {
  Card,
  Grid,
  Typography,
  withStyles,
  WithStyles,
  createStyles,
} from "@material-ui/core";
import { Popup } from "react-leaflet";

import { Pois } from "../../../../store/Reefs/types";
import Link from "../../../Link";

const SurveyPointPopup = ({
  reefId,
  point,
  classes,
}: SurveyPointPopupProps) => {
  return (
    <Popup closeButton={false} autoPan={false}>
      <Card className={classes.surveyPointPopup}>
        <Grid
          container
          alignItems="center"
          justify="space-between"
          item
          spacing={2}
        >
          <Grid title={point.name || ""} item className={classes.nameWrapper}>
            <Typography
              className={classes.name}
              variant="h6"
              color="textSecondary"
            >
              {point.name}
            </Typography>
          </Grid>
          <Grid item>
            <Link
              to={`/reefs/${reefId}/points/${point.id}`}
              isIcon
              tooltipTitle="View survey point"
            />
          </Grid>
        </Grid>
      </Card>
    </Popup>
  );
};

const styles = () =>
  createStyles({
    surveyPointPopup: {
      minWidth: 150,
      maxWidth: 240,
      minHeight: 50,
      padding: 16,
    },
    nameWrapper: {
      maxWidth: "80%",
    },
    name: {
      overflowWrap: "break-word",
    },
  });

interface SurveyPointPopupIncomingProps {
  reefId: number;
  point: Pois;
}

type SurveyPointPopupProps = SurveyPointPopupIncomingProps &
  WithStyles<typeof styles>;

export default withStyles(styles)(SurveyPointPopup);
