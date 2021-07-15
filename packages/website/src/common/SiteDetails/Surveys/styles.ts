import theme from "../../../layout/App/theme";

const styles = {
  dateWrapper: {
    marginBottom: "1rem",
  },
  dates: {
    fontWeight: 500,
    lineHeight: 0.81,
    color: "#757575",
  },
  addNewButton: {
    color: "#979797",
    height: "2rem",
    width: "2rem",
  },
  surveyCardWrapper: {
    marginBottom: "2rem",
    [theme.breakpoints.up("lg")]: {
      maxWidth: "65%",
    },
  },
  surveyCard: {
    width: "100%",
    backgroundColor: theme.palette.primary.light,
    border: 1,
    borderStyle: "solid",
    borderColor: "#dddddd",
    borderRadius: 2,
    height: 320,
    [theme.breakpoints.down("sm")]: {
      height: 640,
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  cardImage: {
    height: "100%",
    width: "100%",
  },
  cardFields: {
    fontWeight: 500,
    lineHeight: 2,
    color: "#9ea6aa",
  },
  cardValues: {
    lineHeight: 2,
    color: "#2f2f2f",
  },
};

export default styles;
