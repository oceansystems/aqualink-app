import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import { NotFound } from "../../routes/NotFound";
import HomePage from "../../routes/Homepage";
import ReefRoutes from "../../routes/ReefRoutes";
import theme from "./theme";
import "./App.css";
import { getSelf } from "../../store/User/userSlice";
import app from "../../firebase";

function App() {
  const [render, setRender] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        user.getIdToken().then((token) => {
          dispatch(getSelf(token));
        });
      }
      setRender(true);
    });
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div id="app">
          {render && (
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/reefs" component={ReefRoutes} />
              <Route default component={NotFound} />
            </Switch>
          )}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
