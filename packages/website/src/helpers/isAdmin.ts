import { User } from "../store/User/types";

export const isAdmin = (user: User | null, reefId: number): boolean => {
  return user
    ? user.adminLevel === "super_admin" ||
        (user.adminLevel === "reef_manager" &&
          Boolean(user.administeredReefs?.find((item) => item.id === reefId)))
    : false;
};
