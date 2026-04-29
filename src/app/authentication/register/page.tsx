"use client";

import React, { useState } from "react";
import {
  Grid,
  Box,
  Card,
  Typography,
  Stack,
  Snackbar,
  Alert,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/components/layout/Logo";
import Header from "@/app/(DashboardLayout)/components/landingPage/Header";
import Footer from "@/app/(DashboardLayout)/components/landingPage/Footer";

const RegisterPage = () => {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [form, setForm] = useState({
    roleId: "",
    email: "",
    mobileNo: "",
    password: "",
    confirmPassword: "",
    status: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [registerErrorMessage, setRegisterErrorMessage] = useState("");

  // Validation
  const validate = () => {
    let tempErrors: { [key: string]: string } = {};

    if (!form.email) tempErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      tempErrors.email = "Invalid email format";

    if (!form.mobileNo) tempErrors.mobileNo = "Phone number is required";
    else if (!/^\d{10}$/.test(form.mobileNo))
      tempErrors.mobileNo = "Invalid Mobile number";

    if (!form.password) tempErrors.password = "Password is required";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(form.password))
      tempErrors.password = "Must contain upper, lower, number & special char (min 8 chars).";

    if (!form.confirmPassword)
      tempErrors.confirmPassword = "Confirm password is required";
    else if (form.password !== form.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
    handleBlur(e);
  };

  const handleBlur = (e: any) => {
    const { id, value } = e.target;
    let tempErrors = { ...errors };

    switch (id) {
      case "email":
        if (!value) tempErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          tempErrors.email = "Invalid email format";
        else tempErrors.email = "";
        break;
      case "mobileNo":
        if (!value) tempErrors.mobileNo = "Phone number is required";
        else if (!/^\d{10}$/.test(value))
          tempErrors.mobileNo = "Invalid phone number";
        else tempErrors.mobileNo = "";
        break;
      case "password":
        if (!value) tempErrors.password = "Password is required";
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/.test(value))
          tempErrors.password = "Must contain upper, lower, number & special char (min 8 chars).";
        else tempErrors.password = "";
        break;
      case "confirmPassword":
        if (!value) tempErrors.confirmPassword = "Confirm password is required";
        else if (value !== form.password)
          tempErrors.confirmPassword = "Passwords do not match";
        else tempErrors.confirmPassword = "";
        break;
      default:
        break;
    }

    setErrors(tempErrors);
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setRegisterErrorMessage("");
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleId: 3,
          email: form.email,
          mobileNo: form.mobileNo,
          password: form.password,
          status: "Enable",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setResponseMessage(data.message);
        setLoading(false);
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push("/authentication/login");
        }, 2000);
      } else {
        setRegisterErrorMessage(data.message);
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      setRegisterErrorMessage(error.message);
      console.error("Error registering user:", error);
    }
  };

  return (
    <PageContainer title="Register" description="this is Register page">
      <Header />
      <Box
        sx={{
          position: "relative",
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
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh", padding: { xs: 2, sm: 3, md: 4 } }}
        >
          <Grid
            item
            xs={12}
            sm={8}
            md={6}
            lg={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              sx={{
                p: 3,
                zIndex: 1,
                width: "100%",
                maxWidth: 350,
                borderRadius: 1,
              }}
            >
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

              {/* Register Form */}
              <Box component="form" onSubmit={handleSubmit}>
                {registerErrorMessage && (
                  <Box>
                    <Alert severity="error">{registerErrorMessage}</Alert>
                  </Box>
                )}
                <TextField
                  id="email"
                  variant="outlined"
                  fullWidth
                  className="customTextField"
                  label='Email'
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ mb: 2 }}
                />
                <TextField
                  id="mobileNo"
                  variant="outlined"
                  fullWidth
                  className="customTextField"
                  label='Mobile No'
                  value={form.mobileNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.mobileNo}
                  helperText={errors.mobileNo}
                  sx={{ mb: 2 }}
                />
                <TextField
                  id="password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  label='Password'
                  className="customTextField"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{ mb: 2 }}
                />
                <TextField
                  id="confirmPassword"
                  type="password"
                  variant="outlined"
                  fullWidth
                  label='Confirm Password'
                  className="customTextField"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={{ mb: 3 }}
                />

                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={loading}
                  sx={{ backgroundColor: "brown" }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Box>

              {/* Footer */}
              <Stack
                direction="row"
                justifyContent="center"
                spacing={1.5}
                mt={3}
              >
                <Typography color="textSecondary" variant="h6" fontWeight="400" sx={{ fontSize: 11 }}>
                  Already have an Account?
                </Typography>
                <Typography
                  component={Link}
                  href="/authentication/login"
                  fontWeight="500"
                  sx={{ textDecoration: "none", color: "primary.main", fontSize: 11 }}
                >
                  Sign In
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Success Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {responseMessage}
          </Alert>
        </Snackbar>
      </Box>
      <Footer />
    </PageContainer>
  );
};

export default RegisterPage;
