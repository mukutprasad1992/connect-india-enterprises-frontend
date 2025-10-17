"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Card,
  Stack,
  TextField,
  Button,
  Divider,
  Typography,
  Grid,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert
} from "@mui/material";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import FacebookIcon from "@mui/icons-material/Facebook";
import axios from "axios";
import Logo from "@/app/(DashboardLayout)/components/layout/Logo";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Header from "@/app/(DashboardLayout)/components/landingPage/Header";
import Footer from "@/app/(DashboardLayout)/components/landingPage/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type FieldName = "email" | "password";
interface FormState {
  email: string;
  password: string;
}
interface ErrorState {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [values, setValues] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<ErrorState>({ email: "", password: "" });
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    email: false,
    password: false,
  });

  const [loading, setLoading] = useState(false);
  const [loadingOAuth, setLoadingOAuth] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // Single-field validator
  const validateField = (name: FieldName, value: string): string => {
    if (name === "email") {
      if (!value.trim()) return "Email is required.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email format.";
    }
    if (name === "password") {
      if (!value.trim()) return "Password is required.";
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(value))
        return "Must contain upper, lower, number & special char (min 8 chars).";
    }
    return "";
  };

  // Change handler — validate only if field was already touched
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: FieldName; value: string };
    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  // Blur handler — mark touched + validate
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: FieldName; value: string };
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Validate all fields and mark all touched (used on submit)
  const validateAll = (): boolean => {
    const newErrors: ErrorState = {
      email: validateField("email", values.email),
      password: validateField("password", values.password),
    };
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return !Object.values(newErrors).some(Boolean);
  };


  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, values);
      const data = response.data.data;

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("roleId", data.roleId);

      setSnackbarSeverity("success");
      setSnackbarMessage("Login successful!");
      setSnackbarOpen(true);

      if (data.roleId === 2) router.replace("/utilities/customer");
      else router.replace("/dashboard");
    } catch (err: any) {
      setSnackbarSeverity("error");
      setSnackbarMessage(err.response?.data?.message || "Login failed.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Google login redirect
  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    // Redirect to your backend Facebook auth route
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/facebook`;
  };
  // OAuth token handler
  useEffect(() => {
    const token = searchParams?.get("token");
    if (!token) return;

    const fetchUserData = async () => {
      setLoadingOAuth(true);
      try {
        const res = await axios.get(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;

        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("roleId", data.roleId);

        if (data.roleId === 2) router.replace("/utilities/customer");
        else router.replace("/dashboard")

        // remove token query param from URL
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
      } catch (err) {
        console.error("OAuth fetch error:", err);
        setSnackbarSeverity("error");
        setSnackbarMessage("Google login failed. Try again.");
        setSnackbarOpen(true);
      } finally {
        setLoadingOAuth(false);
      }
    };

    fetchUserData();
  }, [searchParams, router]);

  return (
    <PageContainer title="Login" description="this is Login page">
      <Header />
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
                  label="Email"
                  name="email"
                  fullWidth
                  className="customTextField"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && !!errors.email}
                  helperText={touched.email ? errors.email : ""}
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
                  label="Password"
                  name="password"
                  type="password"
                  className="customTextField"
                  fullWidth
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && !!errors.password}
                  helperText={touched.password ? errors.password : ""}
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
            <Divider sx={{ fontSize: 12 }}>Or continue with</Divider>

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
                  onClick={handleGoogleLogin}
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
                  onClick={handleFacebookLogin}
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
              sx={{ mt: 2, textDecoration: "none", color: "primary.main", fontSize: 12 }}
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
      <Footer />
    </PageContainer >
  );
}
