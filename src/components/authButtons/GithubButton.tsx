import React from "react";
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";

export const GithubButton = () => {
  return (
    <Button
      type="submit"
      variant="contained"
      startIcon={<GitHubIcon />}
      sx={{
        backgroundColor: "#333",
        color: "#fff",
        "&:hover": {
          backgroundColor: "#555",
        },
        textTransform: "none",
      }}
    >
      Sign in with GitHub
    </Button>
  );
};
