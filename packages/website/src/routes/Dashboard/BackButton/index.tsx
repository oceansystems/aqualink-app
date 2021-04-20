import React from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Box,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Link } from "react-router-dom";

const BackButton = ({ collectionName, classes }: BackButtonProps) => {
  return (
    <Box mt="50px">
      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <Button component={Link} to="/map">
            <ArrowBackIcon color="primary" />
          </Button>
        </Grid>
        <Grid item>
          <Typography className={classes.name} color="textSecondary">
            {collectionName}
          </Typography>
        </Grid>
        {/* TODO: Add collection name edit functionality */}
        {/* <Grid item>
          <IconButton>
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
        </Grid> */}
      </Grid>
    </Box>
  );
};

const styles = () =>
  createStyles({
    name: {
      fontSize: 24,
    },
  });

interface BackButtonIncomingProps {
  collectionName: string;
}

type BackButtonProps = BackButtonIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(BackButton);
