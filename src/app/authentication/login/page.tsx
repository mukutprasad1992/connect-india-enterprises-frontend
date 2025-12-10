"use client";

import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { LiaEyeSlash } from "react-icons/lia";
import { LiaEye } from "react-icons/lia";

// ======================================================
// WRAPPER — required for useSearchParams() on Next.js
// ======================================================
export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}

// ======================================================
// MAIN LOGIN PAGE COMPONENT
// ======================================================
function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);

  const defaultEmail = searchParams.get("email");
  const defaultPassword = searchParams.get("passkey");

  const [formData, setFormData] = useState({
    email: defaultEmail || "",
    password: defaultPassword || "",
  });

  // Handle text field change
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(result.user));
        router.push("/home");
      } else {
        alert(result.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Try again later.");
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
        padding: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Login to Your Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Email Input */}
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          {/* Password Input */}
          <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
            <TextField
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />

            <Box
              onClick={() => setShowPassword(!showPassword)}
              sx={{
                position: "absolute",
                right: 12,
                top: 32,
                cursor: "pointer",
              }}
            >
              {showPassword ? <LiaEye size={22} /> : <LiaEyeSlash size={22} />}
            </Box>
          </Box>

          {/* Submit button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, py: 1.4, borderRadius: 2 }}
          >
            Login
          </Button>

          {/* Google Login */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FcGoogle />}
            sx={{ mt: 2, py: 1.3, borderRadius: 2 }}
          >
            Login with Google
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            Don’t have an account?{" "}
            <span
              style={{ color: "#1976d2", cursor: "pointer", fontWeight: "bold" }}
              onClick={() => router.push("/authentication/register")}
            >
              Register Here
            </span>
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
}
