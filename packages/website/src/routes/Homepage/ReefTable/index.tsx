import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  createStyles,
  Grid,
  Hidden,
  IconButton,
  Table,
  TableContainer,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

import { useSelector } from "react-redux";
import SelectedReefCard from "./SelectedReefCard";
import ReefTableBody from "./body";
import { Order, OrderKeys } from "./utils";
import { reefsListLoadingSelector } from "../../../store/Reefs/reefsListSlice";
import EnhancedTableHead from "./tableHead";
import { useIsMobile } from "../../../helpers/useIsMobile";

const ReefTable = ({ openDrawer, classes }: ReefTableProps) => {
  const loading = useSelector(reefsListLoadingSelector);

  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<OrderKeys>("alert");

  const isMobile = useIsMobile();

  const handleRequestSort = (event: unknown, property: OrderKeys) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <>
      <Hidden smUp>
        <Grid container justify="center" style={{ marginBottom: "-3rem" }}>
          <Grid item>
            <IconButton>
              {openDrawer ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            </IconButton>
          </Grid>
        </Grid>
        {openDrawer ? null : (
          <Typography
            style={{
              position: "relative",
              margin: "1rem 0 0.5rem 1rem",
            }}
            variant="h5"
            color="textSecondary"
          >
            All Reefs
          </Typography>
        )}
      </Hidden>
      <SelectedReefCard />
      <Box
        className={classes.table}
        display="flex"
        flexDirection="column"
        flex={1}
      >
        <TableContainer>
          <Table
            stickyHeader
            style={isMobile ? { tableLayout: "fixed" } : undefined}
          >
            <Hidden xsDown>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
            </Hidden>
            <ReefTableBody order={order} orderBy={orderBy} />
          </Table>
        </TableContainer>
        {loading && (
          <Box
            display="flex"
            flex={1}
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress size="10rem" thickness={1} />
          </Box>
        )}
      </Box>
    </>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    table: {
      paddingLeft: 10,
      height: "70%",
      overflowY: "auto",
      [theme.breakpoints.down("xs")]: {
        paddingLeft: 0,
        height: "auto",
      },
    },
  });

interface ReefTableIncomingProps {
  openDrawer: boolean;
}

type ReefTableProps = ReefTableIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(ReefTable);
