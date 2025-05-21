"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
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

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  useEffect(() => {
    const urlToken = searchParams.get("token");
    setToken(urlToken);
  }, [searchParams]);

  const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const validatePassword = (password: string, confirmPassword: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return false;
    }
    if (!passwordRegex.test(password)) {
      setPasswordError("Password must be at least 6 characters long, contain one special character, and one alphanumeric.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError("");

    if (!validatePassword(newPassword, confirmPassword)) return;

    if (!token) {
      setSnackbarMessage("Reset token not found in URL.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setLoading(true)
    try {
      const response = await axios.post(`${BASE_URL}/auth/resetPassword`, {
        token,
        newPassword,
      });
      setLoading(false)
      setSnackbarMessage("Password reset successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        setLoading(false)
        router.push("/authentication/login");
      }, 2000);
    } catch (error: any) {
      setLoading(false)
      const message = error?.response?.data?.message || "Failed to reset password.";
      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <PageContainer title="Reset Password" description="Reset your password">
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
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <Logo />
              </Box>
              <Typography fontWeight="700" variant="h4" mb={1} textAlign="center">Reset Password</Typography>
              <Typography variant="body2" textAlign="center" mb={3}>
                Enter your new password and confirm it to reset your password.
              </Typography>
              <Stack component="form" onSubmit={handleSubmit}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="new-password" mb="5px">
                    New Password
                  </Typography>
                  <CustomTextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    error={!!passwordError}
                    helperText={passwordError}
                  />
                </Box>
                <Box mt={3}>
                  <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="confirm-password" mb="5px">
                    Reset Password
                  </Typography>
                  <CustomTextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error={!!passwordError}
                    helperText={passwordError}
                  />
                </Box>
                <Box mt={3}>
                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : ("Reset Password"
                    )}

                  </Button>
                </Box>
              </Stack>
              <Stack direction="row" justifyContent="center" mt={3}>
                <Typography component={Link} href="/authentication/login" fontWeight="500" sx={{ textDecoration: "none", color: "primary.main" }}>
                  Back to Login
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
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
const ResetPasswordWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetPassword />
  </Suspense>
);

export default ResetPasswordWithSuspense;
