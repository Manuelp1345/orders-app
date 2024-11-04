"use server";

import React, { ReactNode } from "react";
import { auth } from "@/auth";
import { UserStoreProvider } from "./UserProvider";

const SessionProvider = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (session?.user) {
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };
  }

  return <UserStoreProvider user={session?.user}>{children}</UserStoreProvider>;
};

export default SessionProvider;
