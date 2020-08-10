import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";

import theme from "./theme";
import Form from "./Form";
import NotFound from "./NotFound";
import "./App.css";

if (process.env.NODE_ENV && process.env.NODE_ENV !== "development") {
  if (process.env.REACT_SENTRY_URL) {
    Sentry.init({ dsn: process.env.REACT_SENTRY_URL });
  } else {
    console.warn(
      "Sentry could not start. Make sure the REACT_SENTRY_URL environment variable is set."
    );
  }
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div id="app">
          <Switch>
            {/* Redirect the home to Aqualink website */}
            <Route
              exact
              path="/"
              component={() => {
                window.location.replace("https://www.aqualink.org/");
                return null;
              }}
            />
            <Route exact path="/join/:appHash" component={Form} />
            <Route exact path="/:appId/:uid" component={Form} />

            <Route default component={NotFound} />
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
