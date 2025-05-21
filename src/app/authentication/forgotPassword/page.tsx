"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Grid,
  Box,
  Card,
  Stack,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // Validate email format
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!validateEmail(e.target.value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleForgotPassword = async () => {
    // Basic validation
    if (!email) {
      setEmailError("Email is required.");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/forgotPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbarMessage(data.message || "Reset link sent successfully!");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(data.message || "Failed to send reset link!");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <PageContainer title="Forgot Password" description="Reset your password">
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
        <Grid container spacing={0} justifyContent="center" sx={{ height: "100vh" }}>
          <Grid item xs={12} sm={12} lg={4} xl={3} display="flex" justifyContent="center" alignItems="center">
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>
              <Typography variant="h5" fontWeight="700" textAlign="center" mt={2} mb={2}>
                Forgot Password
              </Typography>
              <Typography variant="body2" textAlign="center" mb={3}>
                Enter your email address and we&apos;ll send you a link to reset your password.
              </Typography>

              <CustomTextField
                fullWidth
                label="Email Address"
                variant="outlined"
                size="small"
                value={email}
                onChange={handleEmailChange}
                error={Boolean(emailError)}
                helperText={emailError}
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, height: "40px" }}
                onClick={handleForgotPassword}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <Stack direction="row" justifyContent="center" mt={2}>
                <Typography
                  component={Link}
                  href="/authentication/login"
                  sx={{ textDecoration: "none", color: "primary.main" }}
                >
                  Back to Login
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ForgotPassword;
