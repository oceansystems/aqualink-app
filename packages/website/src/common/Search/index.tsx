/* eslint-disable fp/no-mutating-methods */
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  withStyles,
  WithStyles,
  createStyles,
  IconButton,
  TextField,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useHistory } from "react-router-dom";

import {
  setReefOnMap,
  setSearchResult,
} from "../../store/Homepage/homepageSlice";
import type { Reef } from "../../store/Reefs/types";
import {
  reefsListSelector,
  reefsRequest,
} from "../../store/Reefs/reefsListSlice";
import { getReefNameAndRegion } from "../../store/Reefs/helpers";
import mapServices from "../../services/mapServices";

const reefAugmentedName = (reef: Reef) => {
  const { name, region } = getReefNameAndRegion(reef);
  if (name && region) {
    return `${name}, ${region}`;
  }
  return name || region || "";
};

const Search = ({ geocodingEnabled, classes }: SearchProps) => {
  const browserHistory = useHistory();
  const [searchedReef, setSearchedReef] = useState<Reef | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const reefs = useSelector(reefsListSelector);
  const filteredReefs = (reefs || [])
    .filter((reef) => reefAugmentedName(reef))
    // Sort by formatted name
    .sort((a, b) => {
      const nameA = reefAugmentedName(a);
      const nameB = reefAugmentedName(b);
      return nameA.localeCompare(nameB);
    });

  // Fetch reefs for the search bar
  useEffect(() => {
    if (!reefs) {
      dispatch(reefsRequest());
    }
  }, [dispatch, reefs]);

  const onChangeSearchText = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const searchInput = event.target.value;
    const index = filteredReefs.findIndex(
      (reef) =>
        reefAugmentedName(reef).toLowerCase() === searchInput.toLowerCase()
    );
    if (index > -1) {
      setSearchedReef(filteredReefs[index]);
    } else {
      setSearchValue(searchInput);
    }
  };

  const onDropdownItemSelect = (event: ChangeEvent<{}>, value: Reef | null) => {
    if (value) {
      setSearchedReef(null);
      dispatch(setReefOnMap(value));
      if (!geocodingEnabled) {
        browserHistory.push(`/reefs/${value.id}`);
      }
    }
  };

  const onSearchSubmit = () => {
    if (searchedReef) {
      if (!geocodingEnabled) {
        browserHistory.push(`/reefs/${searchedReef.id}`);
      }
      dispatch(setReefOnMap(searchedReef));
      setSearchedReef(null);
    } else if (searchValue && geocodingEnabled) {
      mapServices
        .getLocation(searchValue)
        .then((data) => dispatch(setSearchResult(data)))
        .catch(console.error);
    }
  };

  const onKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      onSearchSubmit();
    }
  };

  return (
    <div className={classes.searchBar}>
      <div className={classes.searchBarIcon}>
        <IconButton size="small" onClick={onSearchSubmit}>
          <SearchIcon />
        </IconButton>
      </div>

      <div className={classes.searchBarText}>
        <Autocomplete
          classes={{ listbox: classes.listbox, option: classes.option }}
          id="location"
          autoHighlight
          onKeyPress={onKeyPress}
          className={classes.searchBarInput}
          options={filteredReefs}
          noOptionsText={
            geocodingEnabled
              ? `No sites found. Press enter to zoom to "${searchValue}"`
              : undefined
          }
          getOptionLabel={reefAugmentedName}
          value={searchedReef}
          onChange={onDropdownItemSelect}
          onInputChange={(_event, _value, reason) =>
            reason === "clear" && setSearchedReef(null)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onChangeSearchText}
              placeholder="Search"
              variant="outlined"
              InputLabelProps={{
                shrink: false,
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

const styles = () =>
  createStyles({
    searchBar: {
      display: "flex",
      alignItems: "stretch",
      borderRadius: 4,
      overflow: "hidden",
    },
    searchBarIcon: {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "#6ba8c0",
      width: 40,
    },
    searchBarText: {
      paddingLeft: "0.5rem",
      backgroundColor: "#469abb",
      flexGrow: 1,
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
    listbox: {
      overflowX: "hidden",
    },
    option: {
      display: "block",
      overflowWrap: "break-word",
    },
  });

interface SearchIncomingProps {
  geocodingEnabled?: boolean;
}

Search.defaultProps = {
  geocodingEnabled: false,
};

type SearchProps = SearchIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(Search);
