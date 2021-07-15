import React from "react";
import { Link } from "react-router-dom";
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme,
  Dialog as MuiDialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  ButtonProps,
  Button,
} from "@material-ui/core";

const Dialog = ({
  open,
  header,
  content,
  actions,
  onClose,
  classes,
}: DialogProps) => {
  return (
    <MuiDialog fullWidth onClose={onClose} open={open}>
      <DialogTitle className={classes.dialogTitle}>
        <Typography>{header}</Typography>
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        {actions &&
          actions.map((action) => {
            if (action.link) {
              return (
                <Link
                  key={action.text}
                  style={{ color: "inherit", textDecoration: "none" }}
                  to={action.link}
                >
                  <Button
                    key={action.text}
                    color={action.color}
                    variant={action.variant}
                    size={action.size}
                    disabled={action.disabled}
                    onClick={action.action}
                  >
                    {action.text}
                  </Button>
                </Link>
              );
            }
            return (
              <Button
                key={action.text}
                color={action.color}
                variant={action.variant}
                size={action.size}
                disabled={action.disabled}
                onClick={action.action}
              >
                {action.text}
              </Button>
            );
          })}
      </DialogActions>
    </MuiDialog>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    dialogTitle: {
      backgroundColor: theme.palette.primary.main,
      overflowWrap: "break-word",
    },
  });

export interface Action {
  size: ButtonProps["size"];
  variant: ButtonProps["variant"];
  color: ButtonProps["color"];
  text: string;
  link?: string;
  disabled?: boolean;
  action: (...args: any[]) => void;
}

interface DialogIncomingProps {
  open: boolean;
  header?: string;
  content?: JSX.Element | null;
  actions?: Action[];
  onClose?: (...args: any[]) => void;
}

Dialog.defaultProps = {
  header: "",
  content: null,
  actions: [],
  onClose: () => {},
};

type DialogProps = DialogIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(Dialog);
