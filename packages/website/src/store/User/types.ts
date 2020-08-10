export interface User {
  email?: string | null;
  firebaseUid?: string | null;
  token?: string | null;
}

export interface UserState {
  userInfo: User | null;
  loading: boolean;
  error?: string | null;
}

export interface UserRegisterParams {
  fullName: string;
  email: string;
  password: string;
}

export interface UserSignInParams {
  email: string;
  password: string;
}
