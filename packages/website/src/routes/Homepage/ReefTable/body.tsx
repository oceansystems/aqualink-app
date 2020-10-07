import {
  TableBody,
  TableCell,
  TableRow,
  Typography,
  createStyles,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TableRow as Row } from "../../../store/Homepage/types";
import { constructTableData } from "../../../store/Reefs/helpers";
import { colors } from "../../../layout/App/theme";
import { dhwColorFinder } from "../../../helpers/degreeHeatingWeeks";
import { alertColorFinder } from "../../../helpers/bleachingAlertIntervals";
import { formatNumber } from "../../../helpers/numberUtils";
import { reefsListSelector } from "../../../store/Reefs/reefsListSlice";
import {
  reefOnMapSelector,
  setReefOnMap,
} from "../../../store/Homepage/homepageSlice";
import { getComparator, Order, OrderKeys, stableSort } from "./utils";

const ReefTableBody = ({ order, orderBy, classes }: ReefTableBodyProps) => {
  const dispatch = useDispatch();
  const reefsList = useSelector(reefsListSelector);
  const reefOnMap = useSelector(reefOnMapSelector);
  const [selectedRow, setSelectedRow] = useState<number>();

  const handleClick = (event: unknown, reef: Row) => {
    setSelectedRow(reef.tableData.id);
    dispatch(setReefOnMap(reefsList[reef.tableData.id]));
  };

  useEffect(() => {
    const index = reefsList.findIndex((item) => item.id === reefOnMap?.id);
    setSelectedRow(index);
  }, [reefOnMap, reefsList]);

  useEffect(() => {
    const child = document.getElementById(`homepage-table-row-${selectedRow}`);
    if (child) {
      child.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [selectedRow]);

  return (
    <TableBody>
      {stableSort<Row>(
        constructTableData(reefsList),
        getComparator(order, orderBy)
      ).map((reef) => {
        return (
          <TableRow
            id={`homepage-table-row-${reef.tableData.id}`}
            hover
            style={{
              backgroundColor:
                reef.tableData.id === selectedRow
                  ? colors.lighterBlue
                  : "white",
              cursor: "pointer",
            }}
            onClick={(event) => handleClick(event, reef)}
            role="button"
            tabIndex={-1}
            key={reef.tableData.id}
          >
            <TableCell className={classes.nameCells}>
              <Typography
                align="left"
                variant="subtitle1"
                color="textSecondary"
              >
                {reef.locationName}
              </Typography>
            </TableCell>
            <TableCell align="left">
              <Typography
                style={{ color: colors.lightBlue }}
                variant="subtitle1"
              >
                {formatNumber(reef.temp, 1)}
              </Typography>
            </TableCell>
            <TableCell align="left">
              <Typography
                style={{
                  color: reef.dhw ? `${dhwColorFinder(reef.dhw)}` : "black",
                }}
                variant="subtitle1"
              >
                {formatNumber(reef.dhw, 1)}
              </Typography>
            </TableCell>
            <TableCell align="center">
              <ErrorIcon
                style={{
                  color: alertColorFinder(reef.alertLevel),
                }}
              />
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};

const styles = () =>
  createStyles({
    nameCells: {
      paddingLeft: 10,
    },
  });

type ReefTableBodyIncomingProps = {
  order: Order;
  orderBy: OrderKeys;
};

type ReefTableBodyProps = WithStyles<typeof styles> &
  ReefTableBodyIncomingProps;

export default withStyles(styles)(ReefTableBody);
