import React, { ChangeEvent } from "react";
import {
  createStyles,
  Grid,
  withStyles,
  WithStyles,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { useDispatch } from "react-redux";

import TextField from "../../../common/Forms/TextField";
import { useFormField } from "../../../common/Forms/useFormField";
import { User } from "../../../store/User/types";
import userServices from "../../../services/userServices";
import { setUserCollectionName } from "../../../store/User/userSlice";

const EditNameForm = ({
  collectionId,
  initialName,
  signedInUser,
  onClose,
  classes,
}: EditNameFormProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const [collectionName, setCollectionName] = useFormField(initialName, [
    "required",
    "maxLength",
  ]);

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCollectionName(event.target.value);
  };

  const onSubmit = () => {
    if (signedInUser?.token) {
      userServices
        .updateCollection(
          { id: collectionId, name: collectionName.value },
          signedInUser.token
        )
        .then(() => dispatch(setUserCollectionName(collectionName.value)))
        .catch((error) => console.error(error))
        .finally(() => onClose());
    }
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={7}>
          <TextField
            formField={collectionName}
            label="Name"
            name="collectionName"
            placeholder="Collection Name"
            fullWidth
            size="small"
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Grid
            container
            justify={isMobile ? "flex-end" : "flex-start"}
            spacing={1}
          >
            <Grid item>
              <Tooltip title="Save" placement="top" arrow>
                <IconButton
                  disabled={!!collectionName.error}
                  onClick={onSubmit}
                  className={classes.checkButton}
                >
                  <CheckIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Cancel" placement="top" arrow>
                <IconButton onClick={onClose} className={classes.clearIcon}>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const styles = () =>
  createStyles({
    checkButton: {
      color: "#4caf50",
    },
    clearIcon: {
      color: "#f44336",
    },
  });

interface EditNameFormIncomingProps {
  collectionId: number;
  initialName: string;
  signedInUser: User | null;
  onClose: () => void;
}

type EditNameFormProps = EditNameFormIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(EditNameForm);