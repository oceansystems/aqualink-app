import { createMuiTheme } from "@material-ui/core/styles";

const skyBlue = "#009ee0";
const lightBlue = "#168dbd";
const lighterBlue = "#c0e1f0";
const darkGreyBlue = "#2d3436";
const black = "#2f2f2f";
const white = "#ffffff";
const lightGray = "#939393";

const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

export const colors = { skyBlue, lightBlue, lighterBlue, darkGreyBlue };

const theme: any = createMuiTheme({
  palette: {
    primary: {
      main: lightBlue,
      dark: darkGreyBlue,
      light: white,
    },
    text: {
      primary: white,
      secondary: black,
    },
    grey: {
      500: lightGray,
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        height: 122,
        justifyContent: "center",
        backgroundColor: lightBlue,
      },
    },
    MuiToolbar: {
      root: {
        justifyContent: "space-between",
      },
      dense: {
        minHeight: 40,
      },
    },
    MuiTypography: {
      h1: {
        fontSize: 52,
        fontFamily,
      },
      h2: {
        fontSize: 48,
        fontFamily,
      },
      h3: {
        fontSize: 32,
        fontFamily,
      },
      h4: {
        fontSize: 26,
        fontFamily,
      },
      h5: {
        fontSize: 20,
        fontFamily,
      },
      h6: {
        fontSize: 16,
        fontFamily,
      },
      subtitle1: {
        fontSize: 14,
        fontFamily,
      },
      subtitle2: {
        fontSize: 12,
        fontFamily,
      },
      caption: {
        fontSize: 10,
        fontFamily,
      },
      overline: {
        fontSize: 8.5,
        fontFamily,
      },
      gutterBottom: {
        marginBottom: "1rem",
      },
    },
    MuiGrid: {
      "spacing-xs-10": {
        width: "100%",
        margin: "0",
      },
    },
    MuiButton: {
      root: {
        borderRadius: 5,
      },
      containedPrimary: {
        backgroundColor: lightBlue,
      },
      containedSecondary: {
        backgroundColor: darkGreyBlue,
      },
    },
    MuiCardContent: {
      root: {
        "&:last-child": {
          paddingBottom: 0,
        },
      },
    },
    MuiInputLabel: {
      root: {
        color: lightGray,
      },
    },
    MuiInputBase: {
      root: {
        height: "100%",
      },
    },
    MuiOutlinedInput: {
      root: {
        padding: 0,
      },
    },
  },
});

export default theme;
