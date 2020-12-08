import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
  AsyncThunk,
} from "@reduxjs/toolkit";
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
    { fullName, email, organization, password }: UserRegisterParams,
    { rejectWithValue }
  ) => {
    let user;
    try {
      // eslint-disable-next-line fp/no-mutation
      user = (await userServices.createUser(email, password))?.user;
      const token = await user?.getIdToken();

      const { data } = await userServices.storeUser(
        fullName,
        email,
        organization,
        token
      );

      return {
        email: data.email,
        fullName: data.fullName,
        organization: data.organization,
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
      const { user } = (await userServices.signInUser(email, password)) || {};
      const token = await user?.getIdToken();
      const { data: userData } = await userServices.getSelf(token);
      return {
        email: userData.email,
        fullName: userData.fullName,
        organization: userData.organization,
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
        organization: userData.organization,
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

function addAsyncReducer<Out, In, ThunkParams extends CreateAsyncThunkTypes>(
  builder: ActionReducerMapBuilder<UserState>,
  thunk: AsyncThunk<Out, In, ThunkParams>,
  // there's no easy way (I know of) to take a type - UserState - and make everything in it optional
  rejected: (action: PayloadAction<UserState["error"]>) => UserState | any = (
    action
  ) => ({
    userInfo: null,
    error: action.payload,
    loading: false,
  }),
  fulfilled: (action: PayloadAction<Out>) => UserState | any = (action) => ({
    userInfo: action.payload,
    loading: false,
  })
) {
  builder.addCase(thunk.fulfilled, (state, action: PayloadAction<Out>) => ({
    ...state,
    ...fulfilled(action),
  }));
  builder.addCase(
    thunk.rejected,
    (state, action: PayloadAction<UserState["error"]>) => ({
      ...state,
      ...rejected(action),
    })
  );
  builder.addCase(thunk.pending, (state) => ({
    ...state,
    loading: true,
    error: null,
  }));
}

const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      if (state.userInfo) {
        return {
          ...state,
          userInfo: {
            ...state.userInfo,
            token: action.payload,
          },
        };
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    // User Create
    addAsyncReducer(builder, createUser, (action) => ({
      error: action.payload,
      loading: false,
    }));
    // User Sign In
    addAsyncReducer(builder, signInUser);
    // User Sign Out
    addAsyncReducer(builder, signOutUser);
    // Get self
    addAsyncReducer(builder, getSelf, (action) => ({
      error: action.payload,
      loading: false,
    }));
  },
});

export const userInfoSelector = (state: RootState): UserState["userInfo"] =>
  state.user.userInfo;

export const userLoadingSelector = (state: RootState): UserState["loading"] =>
  state.user.loading;

export const userErrorSelector = (state: RootState): UserState["error"] =>
  state.user.error;

export const { setToken } = userSlice.actions;

export default userSlice.reducer;
