import ReactGA from "react-ga";

const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID || "";
if (process.env.IS_PROD && !GA_TRACKING_ID) {
  throw new Error(
    "You appear to be trying to do a production build, but no Google Analytics" +
      " tracking id was provided!\nEither set GA_TRACKING_ID as an env variable, or set up a" +
      " .env.prod file."
  );
}

export const initGA = () => {
  ReactGA.initialize(GA_TRACKING_ID);
  ReactGA.pageview(window.location.pathname + window.location.search);
};
