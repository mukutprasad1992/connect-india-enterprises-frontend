import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import axios from "axios";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { validateEmail, validatePassword } from "@/utils/utils";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const router = useRouter();
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
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);

    if (!validatePassword(newPassword)) {
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
      setPasswordError(
        "Password is required!"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: any) => {
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
        localStorage.setItem("user", JSON.stringify(data?.data));
        localStorage.setItem("roleId", data.data.roleId);
        setSnackbarSeverity("success");
        setSnackbarMessage("Login successful!");
        setSnackbarOpen(true);
        if (data.data.roleId === 2) {
          setTimeout(() => {
            router.push("/utilities/customer");
          }, 2000);
        } else {
          setTimeout(() => {
            router.push("/");
          }, 2000);
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Box
      >
        {title && (
          <Typography fontWeight="700" variant="h4" mb={2} textAlign="center">
            {title}
          </Typography>
        )}
        {subtext && (
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            {subtext}
          </Typography>
        )}

        <Stack component="form" onSubmit={handleSubmit} spacing={3}>
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              component="label"
              htmlFor="email"
              mb="5px"
              display="block"
            >
              Email
            </Typography>
            <CustomTextField
              variant="outlined"
              fullWidth
              size="small"
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
              onBlur={validateEmailInput}
              sx={{
                borderRadius: 2,
                "& .MuiFormHelperText-root": {
                  textAlign: "left",
                  marginLeft: "5px",
                },
              }}
            />
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
              display="block"
            >
              Password
            </Typography>
            <CustomTextField
              type="password"
              variant="outlined"
              fullWidth
              size="small"
              value={password}
              onChange={(e: any) => handlePasswordChange(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              onBlur={validatePasswordInput}
              sx={{
                borderRadius: 2,
                "& .MuiFormHelperText-root": {
                  textAlign: "left",
                  marginLeft: "5px",
                },
              }}
            />
          </Box>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Remember this Device"
              />
            </FormGroup>
            <Typography
              component={Link}
              href="/authentication/forgotPassword"
              fontWeight="500"
              sx={{ textDecoration: "none", color: "primary.main" }}
            >
              Forgot Password?
            </Typography>
          </Stack>

          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={loading}
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              backgroundColor: "brown",
              ":hover": {
                backgroundColor: "#5d2d2d",
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </Button>

          {subtitle && (
            <Box mt={2} textAlign="center">
              {subtitle}
            </Box>
          )}
        </Stack>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AuthLogin;
