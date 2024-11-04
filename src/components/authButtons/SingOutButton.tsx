import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

const SignOutButton = () => {
  return (
    <Button
      onClick={async () => {
        await signOut();
      }}
    >
      logout
    </Button>
  );
};

export default SignOutButton;
