import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase";

import type {
  PasswordResetParams,
  User,
  UserState,
  UserRegisterParams,
  UserSignInParams,
} from "./types";
import type { RootState, CreateAsyncThunkTypes } from "../configure";
import userServices from "../../services/userServices";

const userInitialState: UserState = {
  userInfo: null,
  loading: false,
  error: null,
};

const isManager = (user: User) =>
  user.adminLevel === "reef_manager" || user.adminLevel === "super_admin";

export const createUser = createAsyncThunk<
  User,
  UserRegisterParams,
  CreateAsyncThunkTypes
>(
  "user/create",
  async (
    { fullName, email, password }: UserRegisterParams,
    { rejectWithValue }
  ) => {
    let user;
    try {
      user = (await userServices.createUser(email, password)).user;
      const token = await user?.getIdToken();

      const { data } = await userServices.storeUser(fullName, email, token);

      return {
        email: data.email,
        fullName: data.fullName,
        adminLevel: data.adminLevel,
        firebaseUid: data.firebaseUid,
        administeredReefs: isManager(data)
          ? (await userServices.getAdministeredReefs(token)).data
          : [],
        token: await user?.getIdToken(),
      };
    } catch (err) {
      // Delete the user from Firebase if it exists, then rethrow the error
      await user?.delete();
      return rejectWithValue(err.message);
    }
  }
);

export const signInUser = createAsyncThunk<
  User,
  UserSignInParams,
  CreateAsyncThunkTypes
>(
  "user/signIn",
  async ({ email, password }: UserSignInParams, { rejectWithValue }) => {
    try {
      const { user } = await userServices.signInUser(email, password);
      const token = await user?.getIdToken();
      const { data: userData } = await userServices.getSelf(token);
      return {
        email: userData.email,
        fullName: userData.fullName,
        adminLevel: userData.adminLevel,
        firebaseUid: userData.firebaseUid,
        administeredReefs: isManager(userData)
          ? (await userServices.getAdministeredReefs(token)).data
          : [],
        token,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const resetPassword = createAsyncThunk<
  PasswordResetParams,
  PasswordResetParams,
  CreateAsyncThunkTypes
>("user/reset", async ({ email }: PasswordResetParams, { rejectWithValue }) => {
  try {
    await userServices.resetPassword(email);
    return { email };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const getSelf = createAsyncThunk<User, string, CreateAsyncThunkTypes>(
  "user/getSelf",
  async (token: string, { rejectWithValue }) => {
    try {
      const { data: userData } = await userServices.getSelf(token);
      return {
        email: userData.email,
        fullName: userData.fullName,
        adminLevel: userData.adminLevel,
        firebaseUid: userData.firebaseUid,
        administeredReefs: isManager(userData)
          ? (await userServices.getAdministeredReefs(token)).data
          : [],
        token,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
  {
    // If another user action is pending, cancel this request before it starts.
    condition(arg: string, { getState }) {
      const {
        user: { loading },
      } = getState();
      return !loading;
    },
  }
);

export const signOutUser = createAsyncThunk<
  UserState["userInfo"],
  void,
  CreateAsyncThunkTypes
>("user/signOut", async () => {
  try {
    await userServices.signOutUser();
    return null;
  } catch (err) {
    const error: FirebaseError = err;
    return Promise.reject(error.message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {},
  extraReducers: (builder) => {
    // User Create
    builder.addCase(
      createUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        return {
          ...state,
          userInfo: action.payload,
          loading: false,
        };
      }
    );

    builder.addCase(
      createUser.rejected,
      (state, action: PayloadAction<UserState["error"]>) => {
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      }
    );

    builder.addCase(createUser.pending, (state) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    });

    // User Sign In
    builder.addCase(
      signInUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        return {
          ...state,
          userInfo: action.payload,
          loading: false,
        };
      }
    );

    builder.addCase(
      signInUser.rejected,
      (_state, action: PayloadAction<UserState["error"]>) => {
        return {
          userInfo: null,
          error: action.payload,
          loading: false,
        };
      }
    );

    builder.addCase(signInUser.pending, (state) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    });

    // User Sign Out
    builder.addCase(
      signOutUser.fulfilled,
      (state, action: PayloadAction<UserState["userInfo"]>) => {
        return {
          ...state,
          userInfo: action.payload,
          loading: false,
        };
      }
    );

    builder.addCase(
      signOutUser.rejected,
      (_state, action: PayloadAction<UserState["error"]>) => {
        return {
          userInfo: null,
          error: action.payload,
          loading: false,
        };
      }
    );

    builder.addCase(signOutUser.pending, (state) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    });

    // Get self
    builder.addCase(getSelf.fulfilled, (state, action: PayloadAction<User>) => {
      return {
        ...state,
        userInfo: action.payload,
        loading: false,
      };
    });

    builder.addCase(
      getSelf.rejected,
      (state, action: PayloadAction<UserState["error"]>) => {
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      }
    );

    builder.addCase(getSelf.pending, (state) => {
      return {
        ...state,
        loading: true,
        error: null,
      };
    });
  },
});

export const userInfoSelector = (state: RootState): UserState["userInfo"] =>
  state.user.userInfo;

export const userLoadingSelector = (state: RootState): UserState["loading"] =>
  state.user.loading;

export const userErrorSelector = (state: RootState): UserState["error"] =>
  state.user.error;

export default userSlice.reducer;
