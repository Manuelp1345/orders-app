"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { createUserStore } from "@/storage/user/user-storage";

import { type UserStorage } from "@/storage/user/types";
import { User } from "next-auth";

export type CounterStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<CounterStoreApi | undefined>(
  undefined
);

export interface UserStoreProviderProps {
  children: ReactNode;
  user?: User;
}

export const UserStoreProvider = ({
  children,
  user,
}: UserStoreProviderProps) => {
  const storeRef = useRef<CounterStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createUserStore();
  }

  if (user) {
    storeRef.current.setState({
      user: user,
    });
  }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = <T,>(selector: (store: UserStorage) => T): T => {
  const userStoreContext = useContext(UserStoreContext);

  if (!userStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`);
  }

  return useStore(userStoreContext, selector);
};
