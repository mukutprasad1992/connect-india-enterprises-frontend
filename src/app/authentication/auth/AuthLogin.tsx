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

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
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
        "Password must be at least 8 characters long and include one uppercase letter, one number, and one special character."
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
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}
      {subtext}

      <Stack component="form" onSubmit={handleSubmit}>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="email"
            mb="5px"
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
              "& .MuiFormHelperText-root": {
                textAlign: "left",
                marginLeft: "5px",
              },
            }}
          />
        </Box>

        <Box mt="25px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
          >
            Password
          </Typography>
          <CustomTextField
            type="password"
            variant="outlined"
            fullWidth
            size="small"
            value={password}
            onChange={handlePasswordChange}
            error={!!passwordError}
            helperText={passwordError}
            onBlur={validatePasswordInput}
            sx={{
              "& .MuiFormHelperText-root": {
                textAlign: "left",
                marginLeft: "5px",
              },
            }}
          />
        </Box>

        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          my={2}
        >
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Remember this Device"
            />
          </FormGroup>
          <Typography
            component={Link}
            href="/authentication/forgot_password"
            fontWeight="500"
            sx={{ textDecoration: "none", color: "primary.main" }}
          >
            Forgot Password ?
          </Typography>
        </Stack>

        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={loading}
            sx={{ backgroundColor: "brown" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>
        {subtitle}
      </Stack>

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
