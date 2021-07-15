import React, { ChangeEvent, useEffect, useState } from "react";
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme,
  Grid,
  Typography,
  MenuItem,
  Select,
  IconButton,
  Button,
  Tooltip,
  TextField,
  Hidden,
} from "@material-ui/core";
import { Create, DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";

import { Pois } from "../../../../store/Reefs/types";
import EditDialog, { Action } from "../../../Dialog";
import CustomLink from "../../../Link";

const PointSelector = ({
  reefId,
  pointOptions,
  point,
  pointId,
  editPoiNameDraft,
  isReefAdmin,
  editPoiNameLoading,
  onChangePoiName,
  handlePointChange,
  enableEditPoiName,
  disableEditPoiName,
  submitPoiNameUpdate,
  onDeleteButtonClick,
  classes,
}: PointSelectorProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editPoi, setEditPoi] = useState<Pois>();
  const errored = !editPoiNameDraft || editPoiNameDraft.length > 100;

  const onEditDialogClose = () => {
    disableEditPoiName();
    setEditPoi(undefined);
    setEditDialogOpen(false);
  };

  const onEditPoiSubmit = () => {
    if (editPoi) {
      submitPoiNameUpdate(editPoi.id);
    }
  };

  useEffect(() => {
    if (!editPoiNameLoading) {
      setEditPoi(undefined);
      setEditDialogOpen(false);
    }
  }, [editPoiNameLoading]);

  const editDialogActions: Action[] = [
    {
      size: "small",
      variant: "contained",
      color: "secondary",
      text: "Close",
      action: onEditDialogClose,
    },
    {
      size: "small",
      variant: "contained",
      color: "primary",
      text: editPoiNameLoading ? "Updating..." : "Save",
      action: onEditPoiSubmit,
      disabled: editPoiNameLoading || (editPoi && errored),
    },
  ];

  return (
    <>
      {editPoi && (
        <EditDialog
          actions={editDialogActions}
          open={editDialogOpen}
          header={editPoi.name || ""}
          onClose={onEditDialogClose}
          content={
            <TextField
              variant="outlined"
              autoFocus
              className={classes.editPoiTextField}
              fullWidth
              value={editPoiNameDraft}
              onChange={onChangePoiName}
              error={errored}
              helperText={
                // eslint-disable-next-line no-nested-ternary
                !editPoiNameDraft
                  ? "Cannot be empty"
                  : editPoiNameDraft.length > 100
                  ? "Must not exceed 100 characters"
                  : ""
              }
            />
          }
        />
      )}
      <Grid container alignItems="center" item md={12} lg={5} spacing={1}>
        <Grid item>
          <Typography variant="h6" className={classes.subTitle}>
            Survey Point:
          </Typography>
        </Grid>
        <Grid item className={classes.selectorWrapper}>
          <Grid container alignItems="center">
            <Grid item>
              <Select
                className={classes.selector}
                labelId="survey-point"
                id="survey-point"
                name="survey-point"
                value={
                  pointOptions.some((item) => item.name === point)
                    ? point
                    : "All"
                }
                onChange={handlePointChange}
                onClose={() => disableEditPoiName()}
                renderValue={(selected) => selected as string}
              >
                <MenuItem value="All">
                  <Typography className={classes.menuItem} variant="h6">
                    All
                  </Typography>
                </MenuItem>
                {pointOptions.map(
                  (item) =>
                    item.name !== null && (
                      <MenuItem
                        className={classes.menuItem}
                        value={item.name}
                        key={item.id}
                      >
                        <Grid
                          container
                          alignItems="center"
                          justify="space-between"
                          spacing={1}
                        >
                          <Grid className={classes.itemName} item>
                            {item.name}
                          </Grid>
                          <Grid item>
                            <Grid container item spacing={1}>
                              <Grid item>
                                <CustomLink
                                  to={`/reefs/${reefId}/points/${item.id}`}
                                  isIcon
                                  tooltipTitle="View survey point"
                                />
                              </Grid>
                              {isReefAdmin && (
                                <>
                                  <Grid item>
                                    <Tooltip
                                      title="Edit survey point name"
                                      placement="top"
                                      arrow
                                    >
                                      <IconButton
                                        className={classes.menuButton}
                                        onClick={(event) => {
                                          enableEditPoiName(item.id);
                                          setEditDialogOpen(true);
                                          setEditPoi(item);
                                          event.stopPropagation();
                                        }}
                                      >
                                        <Create color="primary" />
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>
                                  <Grid item>
                                    <Tooltip
                                      title="Delete survey point"
                                      placement="top"
                                      arrow
                                    >
                                      <IconButton
                                        className={classes.menuButton}
                                        onClick={(event) => {
                                          onDeleteButtonClick(item.id);
                                          event.stopPropagation();
                                        }}
                                      >
                                        <DeleteOutline color="primary" />
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>
                                </>
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      </MenuItem>
                    )
                )}
              </Select>
            </Grid>
            {pointId !== -1 && (
              <Grid item>
                <Hidden smUp>
                  <CustomLink
                    to={`/reefs/${reefId}/points/${pointId}`}
                    isIcon
                    tooltipTitle="View survey point"
                  />
                </Hidden>
                <Hidden xsDown>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    component={Link}
                    to={`/reefs/${reefId}/points/${pointId}`}
                  >
                    View Survey Point
                  </Button>
                </Hidden>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    subTitle: {
      lineHeight: 1,
      color: "#474747",
      marginRight: "1rem",
    },
    selectorWrapper: {
      [theme.breakpoints.down("xs")]: {
        width: "100%",
      },
    },
    selector: {
      minWidth: 120,
      maxWidth: 190,
      color: theme.palette.primary.main,
      marginRight: "1rem",
    },
    itemName: {
      maxWidth: 140,
      whiteSpace: "normal",
      overflowWrap: "break-word",
      wordWrap: "break-word",
      wordBreak: "break-word",
      hyphens: "auto",
    },
    menuItem: {
      minWidth: 240,
      color: theme.palette.primary.main,
    },
    editPoiTextField: {
      color: "black",
      alignItems: "center",
      padding: 8,
    },
    menuButton: {
      padding: 0,
    },
    checkIcon: {
      color: theme.palette.success.main,
    },
    closeIcon: {
      color: theme.palette.error.main,
    },
  });

interface PointSelectorIncomingProps {
  reefId: number;
  pointOptions: Pois[];
  point: string;
  pointId: number;
  editPoiNameDraft: string | null | undefined;
  isReefAdmin: boolean;
  editPoiNameLoading: boolean;
  onChangePoiName: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handlePointChange: (event: ChangeEvent<{ value: unknown }>) => void;
  enableEditPoiName: (id: number) => void;
  disableEditPoiName: () => void;
  submitPoiNameUpdate: (key: number) => void;
  onDeleteButtonClick: (id: number) => void;
}

type PointSelectorProps = PointSelectorIncomingProps &
  WithStyles<typeof styles>;

export default withStyles(styles)(PointSelector);
