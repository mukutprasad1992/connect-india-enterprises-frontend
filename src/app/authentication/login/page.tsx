"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Grid,
  Box,
  Card,
  Typography,
  Stack,
  Button,
  Snackbar,
  Alert,
  Checkbox,
  FormGroup,
  FormControlLabel,
  CircularProgress,
  TextField,
  Divider,
} from "@mui/material";
import Link from "next/link";
import axios from "axios";
import { validateEmail, validatePassword } from "@/utils/utils";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/components/layout/Logo";
import FacebookIcon from "@mui/icons-material/Facebook";
import { FcGoogle } from "react-icons/fc";
import LogoLogin from "@/app/(DashboardLayout)/components/layout/Logo";

const LoginPage = () => {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // Handlers
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const validateEmailInput = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePasswordInput = () => {
    if (!validatePassword(password)) {
      setPasswordError("Password is required!");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = validateEmailInput();
    const isPasswordValid = validatePasswordInput();
    if (isEmailValid && isPasswordValid) {
      setLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
          email,
          password,
        });
        const data = response.data;

        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.data));
        localStorage.setItem("roleId", data.data.roleId);

        setSnackbarSeverity("success");
        setSnackbarMessage("Login successful!");
        setSnackbarOpen(true);

        if (data.data.roleId === 2) {
          setTimeout(() => router.push("/utilities/customer"), 2000);
        } else {
          setTimeout(() => router.push("/"), 2000);
        }
      } catch (error: any) {
        console.error("Login error:", error);
        setSnackbarSeverity("error");
        setSnackbarMessage(
          error.response?.data?.message || "Login failed. Please try again."
        );
        setSnackbarOpen(true);
      }
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh", // make it full height
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0.9,
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.6",
            top: 0,
            left: 0,
            zIndex: -1,
          },
        }}
      >
        <Card
          sx={{
            py: 3,
            width: "100%",
            maxWidth: 350,
            borderRadius: 1,
            boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Logo */}
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            mb={3}
          >
            <Grid item>
              <Logo />
            </Grid>
          </Grid>
          {/* Login Form */}
          <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
            {/* Email */}
            <Grid container spacing={2}>
              <Grid item xs={11}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Email"
                  className="customTextField"
                  value={email}
                  onChange={handleEmailChange}
                  error={!!emailError}
                  helperText={emailError}
                  onBlur={validateEmailInput}
                  sx={{
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                    },
                  }}
                />
              </Grid>
              {/* Password */}
              <Grid item xs={11}>
                <TextField
                  type="password"
                  variant="outlined"
                  className="customTextField"
                  fullWidth
                  label="Password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                  onBlur={validatePasswordInput}
                  sx={{
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                    },
                  }}
                />
              </Grid>
              {/* Options */}
              <Grid item xs={11}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox size="small" defaultChecked />}
                      label="Remember me"
                      sx={{ "& .MuiFormControlLabel-label": { fontSize: 13 } }}
                    />
                  </FormGroup>

                  <Typography
                    component={Link}
                    href="/authentication/forgotPassword"
                    fontSize={13}
                    sx={{ textDecoration: "none", color: "primary.main" }}
                  >
                    Forgot Password?
                  </Typography>
                </Stack>
              </Grid>
              {/* Submit */}
              <Grid item xs={11}>
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={loading}
                  sx={{
                    borderRadius: 1,
                    py: 1,
                    fontWeight: 600,
                    textTransform: "none",
                    backgroundColor: "brown",
                    ":hover": {
                      backgroundColor: "#5d2d2d",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Grid>
            </Grid>
            {/* Divider */}
            <Divider >Or continue with</Divider>

            {/* Social Buttons */}
            <Grid container >
              <Grid item xs={6} sx={{ pl: 2, pr: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<FcGoogle size={22} />}
                  sx={{
                    borderRadius: 1,
                    textTransform: "none",
                    fontWeight: 500,
                    backgroundColor: "white",
                    color: "#5f6368",
                    borderColor: "#dadce0",
                    ":hover": {
                      backgroundColor: "#f7f8f8",
                    },
                  }}
                  onClick={() => console.log("Google login clicked")}
                >
                  Google
                </Button>
              </Grid>
              <Grid item xs={6} sx={{ pr: 2, pl: 1 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<FacebookIcon />}
                  sx={{
                    borderRadius: 1,
                    textTransform: "none",
                    fontWeight: 500,
                    backgroundColor: "#1877f2",
                    ":hover": {
                      backgroundColor: "#145dbf",
                    },
                  }}
                  onClick={() => console.log("Facebook login clicked")}
                >
                  Facebook
                </Button>
              </Grid>
            </Grid>

            {/* Footer link */}
            <Typography
              component={Link}
              href="/authentication/register"
              fontWeight={500}
              textAlign="center"
              sx={{ mt: 2, textDecoration: "none", color: "primary.main" }}
            >
              Create an account
            </Typography>
          </Stack>
        </Card>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </PageContainer >
  );
};

export default LoginPage;
