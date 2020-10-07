import app from "../firebase";
import requests from "../helpers/requests";

import type { User } from "../store/User/types";
import type { Reef } from "../store/Reefs/types";

const createUser = (email: string, password: string) =>
  app.auth().createUserWithEmailAndPassword(email, password);

const storeUser = (fullName: string, email: string, token?: string) =>
  requests.send<User>({
    method: "POST",
    url: "users",
    data: {
      fullName,
      email,
    },
    token,
  });

const resetPassword = (email: string) => {
  app.auth().sendPasswordResetEmail(email, { url: "https://aqualink.org" });
};

const getSelf = (token?: string) =>
  requests.send<User>({
    method: "GET",
    url: "users/current",
    token,
  });

const getAdministeredReefs = (token?: string) =>
  requests.send<Reef[]>({
    method: "GET",
    url: "users/current/administered-reefs",
    token,
  });

const signInUser = (email: string, password: string) =>
  app.auth().signInWithEmailAndPassword(email, password);

const signOutUser = () => app.auth().signOut();

export default {
  createUser,
  storeUser,
  getAdministeredReefs,
  getSelf,
  resetPassword,
  signInUser,
  signOutUser,
};
