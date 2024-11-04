import React from "react";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";

export const GoogleButton = () => {
  return (
    <Button
      type="submit"
      variant="contained"
      startIcon={<GoogleIcon />}
      sx={{
        backgroundColor: "#4285F4",
        color: "#fff",
        "&:hover": {
          backgroundColor: "#357ae8",
        },
        textTransform: "none",
      }}
    >
      Sign in with Google
    </Button>
  );
};
