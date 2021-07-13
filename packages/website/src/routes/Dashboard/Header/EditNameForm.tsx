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
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { useDispatch } from "react-redux";

import TextField from "../../../common/Forms/TextField";
import { useFormField } from "../../../hooks/useFormField";
import { User } from "../../../store/User/types";
import collectionServices from "../../../services/collectionServices";
import { setName } from "../../../store/Collection/collectionSlice";

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
    if (signedInUser?.token && collectionId) {
      collectionServices
        .updateCollection(
          { id: collectionId, name: collectionName.value },
          signedInUser.token
        )
        .then(() => dispatch(setName(collectionName.value)))
        .catch(console.error)
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
      color: green[500],
    },
    clearIcon: {
      color: red[500],
    },
  });

interface EditNameFormIncomingProps {
  collectionId?: number;
  initialName: string;
  signedInUser: User | null;
  onClose: () => void;
}

EditNameForm.defaultProps = {
  collectionId: undefined,
};

type EditNameFormProps = EditNameFormIncomingProps & WithStyles<typeof styles>;

export default withStyles(styles)(EditNameForm);
