import React from "react";
import {
  createStyles,
  IconButton,
  Modal,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const ImageModal = ({
  imageUrl,
  open,
  handleClose,
  classes,
}: ImageModalProps) => {
  return (
    <Modal open={open} onClose={handleClose} disableRestoreFocus>
      <div>
        <IconButton
          aria-label="Close picture"
          onClick={handleClose}
          className={classes.closeButton}
        >
          <CloseIcon />
        </IconButton>
        <img src={imageUrl} alt="Survey featured" className={classes.image} />
      </div>
    </Modal>
  );
};

const styles = () =>
  createStyles({
    closeButton: {
      width: "50px",
      position: "absolute",
      top: "10px",
      right: "10px",
    },
    image: {
      maxWidth: "90%",
      maxHeight: "90%",
      margin: "auto",
      display: "block",
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
    },
  });

interface ImageModalIncomingProps {
  imageUrl: string;
  open: boolean;
  handleClose: (...args: any[]) => void;
}

type ImageModalProps = ImageModalIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(ImageModal);
