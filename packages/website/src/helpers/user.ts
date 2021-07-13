import { User } from "../store/User/types";
import { CollectionDetails } from "../store/Collection/types";

export const isAdmin = (user: User | null, reefId: number): boolean => {
  return user
    ? user.adminLevel === "super_admin" ||
        (user.adminLevel === "reef_manager" &&
          Boolean(user.administeredReefs?.find((item) => item.id === reefId)))
    : false;
};

export const isManager = (user: User | null) =>
  user
    ? user.adminLevel === "super_admin" || user.adminLevel === "reef_manager"
    : false;

export const isSuperAdmin = (user: User | null) =>
  user ? user.adminLevel === "super_admin" : false;

export const hasCollection = (user: User | null) => !!user?.collection;

export const isCollectionOwner = (
  user: User | null,
  collection: CollectionDetails
) => user?.id === collection.user?.id;
