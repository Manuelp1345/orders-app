import { User } from "next-auth";

export type userAction = {
  setUser: (user: User) => void;
};

export type UserStorage = userAction & {
  user: User;
};
