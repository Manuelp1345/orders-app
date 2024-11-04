import { redirect } from "next/navigation";
import { signIn, providerMap } from "@/auth";
import { AuthError } from "next-auth";

import { Stack, Typography, Box, Paper } from "@mui/material";
import { GoogleButton } from "@/components/authButtons/GoogleButton";
import { GithubButton } from "@/components/authButtons/GithubButton";

enum Provider {
  Google = "google",
  Github = "github",
}

export default function Page() {
  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          <Typography variant="h1" color="primary">
            Orders App
          </Typography>
          <Typography variant="h3" color="textSecondary">
            Sign In
          </Typography>

          {Object.values(providerMap).map((provider) => (
            <form
              key={provider.id}
              action={async () => {
                "use server";

                try {
                  await signIn(provider.id, {
                    redirectTo: "/orders",
                  });
                } catch (error) {
                  if (error instanceof AuthError) {
                    return redirect(
                      `/404?error=${encodeURIComponent(error.message)}`
                    );
                  }
                  throw error;
                }
              }}
            >
              {provider.id === Provider.Google && <GoogleButton />}
              {provider.id === Provider.Github && <GithubButton />}
            </form>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
