import type { Reef } from "../Reefs/types";

export interface User {
  email?: string | null;
  fullName?: string | null;
  adminLevel?: "default" | "reef_manager" | "super_admin";
  firebaseUid?: string | null;
  administeredReefs?: Reef[];
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

export interface PasswordResetParams {
  email: string;
}
