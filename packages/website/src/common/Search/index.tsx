import React, { useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  withStyles,
  WithStyles,
  createStyles,
  Grid,
  IconButton,
  TextField,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { setReefOnMap } from "../../store/Homepage/homepageSlice";
import type { Reef } from "../../store/Reefs/types";
import { reefsListSelector } from "../../store/Reefs/reefsListSlice";

const Search = ({ classes }: SearchProps) => {
  const [searchedReef, setSearchedReef] = useState<Reef | null>(null);
  const dispatch = useDispatch();
  const reefs = useSelector(reefsListSelector);

  const onChangeSearchText = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const searchValue = event.target.value;
    const index = reefs.findIndex(
      (reef) => reef.name?.toLowerCase() === searchValue.toLowerCase()
    );
    if (index > -1) {
      setSearchedReef(reefs[index]);
    }
  };

  const onDropdownItemSelect = (event: ChangeEvent<{}>, value: Reef | null) => {
    if (value) {
      setSearchedReef(value);
      dispatch(setReefOnMap(value));
    }
  };

  const onSearchSubmit = () => {
    if (searchedReef) {
      dispatch(setReefOnMap(searchedReef));
    }
  };

  return (
    <Grid container justify="flex-end" item xs={6}>
      <Grid
        className={classes.searchBar}
        container
        alignItems="center"
        item
        xs={8}
      >
        <Grid
          className={classes.searchBarIcon}
          item
          xs={2}
          container
          alignItems="center"
          justify="center"
        >
          <IconButton size="small" onClick={onSearchSubmit}>
            <SearchIcon />
          </IconButton>
        </Grid>
        <Grid
          className={classes.searchBarText}
          item
          xs={10}
          container
          alignItems="center"
        >
          <Autocomplete
            id="location"
            className={classes.searchBarInput}
            options={reefs}
            getOptionLabel={(reef) => reef.name || ""}
            value={searchedReef}
            onChange={onDropdownItemSelect}
            onInputChange={(event, value, reason) =>
              reason === "clear" && setSearchedReef(null)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onChangeSearchText}
                style={{ height: "100%" }}
                placeholder="Search Location"
                variant="outlined"
                InputLabelProps={{
                  shrink: false,
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

const styles = () =>
  createStyles({
    searchBar: {
      height: 42,
    },
    searchBarIcon: {
      backgroundColor: "#6ba8c0",
      borderRadius: "4px 0 0 4px",
      height: "100%",
    },
    searchBarText: {
      paddingLeft: "0.5rem",
      backgroundColor: "#469abb",
      borderRadius: "0 4px 4px 0",
      height: "100%",
    },
    searchBarInput: {
      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderWidth: 0,
      },
      "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderWidth: 0,
      },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderWidth: 0,
      },
      height: "100%",
      width: "100%",
    },
  });

type SearchProps = WithStyles<typeof styles>;

export default withStyles(styles)(Search);
