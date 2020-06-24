import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import theme from "./theme";
import Form from "./Form";
import NotFound from "./NotFound";
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div id="app">
          <Switch>
            <Route exact path="/" component={Form} />
            <Route default component={NotFound} />
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
