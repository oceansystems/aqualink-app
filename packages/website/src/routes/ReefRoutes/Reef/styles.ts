import theme from "../../../layout/App/theme";

export const styles = {
  cardTitle: {
    lineHeight: 1.5,
    [theme.breakpoints.between("md", 1544)]: {
      width: "10rem",
    },
    [theme.breakpoints.between("sm", 780)]: {
      width: "10rem",
    },
    [theme.breakpoints.down(398)]: {
      width: "10rem",
    },
  },
  header: {
    padding: "0.5rem 1.5rem 0 1rem",
  },
  contentTextTitles: {
    lineHeight: 1.33,
    [theme.breakpoints.between("sm", 740)]: {
      fontSize: 9,
    },
    [theme.breakpoints.between("md", "lg")]: {
      fontSize: 9,
    },
    [theme.breakpoints.down(380)]: {
      fontSize: 11,
    },
  },
  contentTextValues: {
    fontWeight: 300,
    fontSize: 32,
    [theme.breakpoints.between("sm", 740)]: {
      fontSize: 28,
    },
    [theme.breakpoints.between("md", "lg")]: {
      fontSize: 24,
    },
  },
  contentUnits: {
    [theme.breakpoints.between("md", "lg")]: {
      fontSize: 12,
    },
    [theme.breakpoints.between("sm", 740)]: {
      fontSize: 12,
    },
  },
  contentMeasure: {
    marginBottom: "1rem",
  },
};
