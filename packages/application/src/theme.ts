import { createMuiTheme } from "@material-ui/core/styles";

const skyBlue: string = "#009EE0";
const lightBlue: string = "#168DBD";
const darkGreyBlue: string = "#2D3436";
const white: string = "#FFFFFF";
const lightGray = "#CCCCCC";

export const colors = { skyBlue, lightBlue, darkGreyBlue };

const theme: any = createMuiTheme({
  palette: {
    primary: {
      main: lightBlue,
      dark: darkGreyBlue,
    },
    text: {
      primary: white,
      secondary: darkGreyBlue,
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
    MuiInputBase: {
      root: {
        color: "black",
      },
    },
    MuiButtonBase: {
      root: {
        color: "black",
      },
    },
    MuiTypography: {
      h5: {
        fontSize: 26,
      },
      subtitle1: {
        fontSize: 14,
      },
      subtitle2: {
        fontSize: 12,
      },
      caption: {
        fontSize: 10,
      },
      gutterBottom: {
        marginBottom: "3rem",
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
  },
});

export default theme;
