"use client";
import { createStore } from "zustand/vanilla";

import { User } from "next-auth";
import { UserStorage } from "./types";

export const defaultInitState: User = {};
export const createUserStore = (initState: User = defaultInitState) => {
  return createStore<UserStorage>()((set) => ({
    user: initState,
    setUser: (user: User) => set({ user: user }),
  }));
};
