/* eslint-disable import/no-cycle */
import { combineReducers } from "redux";
import selectedReef from "./Reefs/selectedReefSlice";
import reefsList from "./Reefs/reefsListSlice";
import homepage from "./Homepage/homepageSlice";
import user from "./User/userSlice";

const appReducer = combineReducers({
  selectedReef,
  reefsList,
  homepage,
  user,
});

export default appReducer;
