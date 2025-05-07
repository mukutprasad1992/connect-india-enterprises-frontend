"use client";
import { Grid, Box, Card, Typography, Stack } from "@mui/material";
import Link from "next/link";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import AuthRegister from "../auth/AuthRegister";

const Register2 = () => (
  <PageContainer title="Register" description="this is Register page">
    <Box
      sx={{
        position: "relative",
        opacity: 0.8,
        "&:before": {
          content: '""',
          background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
          backgroundSize: "400% 400%",
          animation: "gradient 15s ease infinite",
          position: "absolute",
          height: "100%",
          width: "100%",
          opacity: "0.6",
        },
      }}
    >
      <Grid
        container
        spacing={0}
        justifyContent="center"
        sx={{
          height: "100vh",
          padding: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Grid
          item
          xs={12} sm={8} md={6} lg={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Card
            sx={{
              p: 4,
              zIndex: 1,
              width: "100%",
              maxWidth: "100%",
              borderRadius: 2,
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
              <Logo />
            </Box>
            <AuthRegister
              subtitle={
                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={1.5}
                  mt={3}
                >
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                  >
                    Already have an Account?
                  </Typography>
                  <Typography
                    component={Link}
                    href="/authentication/login"
                    fontWeight="500"
                    sx={{
                      textDecoration: "none",
                      color: "primary.main",
                    }}
                  >
                    Sign In
                  </Typography>
                </Stack>
              }
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  </PageContainer>
);

export default Register2;
