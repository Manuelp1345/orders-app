import NavigationBar from "@/components/dashboard/NavigationBar";
import SessionProvider from "@/components/providers/SessionProvider";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <NavigationBar />
      {children}
    </SessionProvider>
  );
};

export default layout;
