import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  List,
  ListItem,
  ListItemText,
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import {
  reefsListSelector,
  reefsRequest,
} from "../../../store/Reefs/reefsListSlice";

const ReefsList = ({ classes }: ReefsListProps) => {
  const reefsList = useSelector(reefsListSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!reefsList) {
      dispatch(reefsRequest());
    }
  }, [dispatch, reefsList]);

  return (
    <>
      <div className={classes.root}>
        <List component="nav">
          {reefsList?.map((reef) => (
            <Link
              key={`reef-list-item-${reef.id}`}
              style={{ color: "inherit", textDecoration: "none" }}
              to={`/reefs/${reef.id}`}
            >
              <ListItem button>
                <ListItemText style={{ color: "white" }} primary={reef.name} />
              </ListItem>
            </Link>
          ))}
        </List>
      </div>
    </>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.primary.dark,
    },
  });

type ReefsListProps = WithStyles<typeof styles>;

export default withStyles(styles)(ReefsList);
