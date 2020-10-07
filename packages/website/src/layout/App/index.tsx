import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import { NotFound } from "../../routes/NotFound";
import HomePage from "../../routes/Homepage";
import ReefRoutes from "../../routes/ReefRoutes";
import About from "../../routes/About";
import Apply from "../../routes/Apply";
import Buoy from "../../routes/Buoy";
import Drones from "../../routes/Drones";
import Faq from "../../routes/Faq";
import theme from "./theme";
import "leaflet/dist/leaflet.css";
import "./App.css";
import "../../assets/css/bootstrap.css";
import { getSelf } from "../../store/User/userSlice";
import app from "../../firebase";
import { initGA } from "../../utils/google-analytics";

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
    initGA();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div id="app">
          {render && (
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/about" component={About} />
              <Route exact path="/apply" component={Apply} />
              <Route exact path="/buoy" component={Buoy} />
              <Route exact path="/drones" component={Drones} />
              <Route exact path="/faq" component={Faq} />
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
