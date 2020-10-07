import React from "react";
import { Switch, Route } from "react-router-dom";

import Reef from "./Reef";
import ReefsList from "./ReefsList";
import Surveys from "../Surveys";

const ReefRoutes = () => {
  return (
    <Switch>
      <Route exact path="/reefs" component={ReefsList} />
      <Route exact path="/reefs/:id" component={Reef} />
      <Route
        exact
        path="/reefs/:id/new_survey"
        render={(props) => <Surveys {...props} isView={false} />}
      />
      <Route
        exact
        path="/reefs/:id/survey_details/:sid"
        render={(props) => <Surveys {...props} isView />}
      />
    </Switch>
  );
};

export default ReefRoutes;
