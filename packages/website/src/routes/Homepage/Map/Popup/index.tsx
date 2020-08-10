import React from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import { Reef } from "../../../../store/Reefs/types";
import { colors } from "../../../../layout/App/theme";

const Popup = ({ reef, classes }: PopupProps) => (
  <Card>
    <CardHeader
      className={classes.popupHeader}
      title={reef.name}
      subheader={reef.region}
    />
    <CardContent>
      <Grid container item xs={12}>
        <Grid container justify="flex-start" item xs={6}>
          <Typography variant="caption" color="textSecondary">
            TEMP AT 25M
          </Typography>
          <Typography
            style={{ color: colors.lightBlue }}
            variant="h5"
            color="textSecondary"
          >
            31.8 &#8451;
          </Typography>
        </Grid>
        <Grid container justify="flex-end" item xs={6}>
          <Typography variant="caption" color="textSecondary">
            DEG. HEAT. DAYS
          </Typography>
          <Typography
            style={{ color: "purple" }}
            variant="h5"
            color="textSecondary"
          >
            58
          </Typography>
        </Grid>
      </Grid>
      <Grid
        style={{ margin: "1rem 0 1rem 0" }}
        container
        justify="flex-start"
        item
        xs={12}
      >
        <Grid item>
          <Link
            style={{ color: "inherit", textDecoration: "none" }}
            to={`/reefs/${reef.id}`}
          >
            <Button size="small" variant="outlined" color="primary">
              EXPLORE
            </Button>
          </Link>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const styles = (theme: Theme) =>
  createStyles({
    popupHeader: {
      backgroundColor: theme.palette.primary.main,
    },
  });

interface PopupIncomingProps {
  reef: Reef;
}

type PopupProps = PopupIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(Popup);
