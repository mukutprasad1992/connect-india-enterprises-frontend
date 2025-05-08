"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/authentication/register" || pathname === "/authentication/login" || pathname === "/authentication/forgot_password" || pathname === "/authentication/reset_password";

  return (
    <html lang="en">
      <body>
        {isAuthPage ? (
          <Box
            sx={{
              backgroundImage: 'url(https://picsum.photos/1000/700)', // Replace with your image path
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backdropFilter: 'blur(5px)', // Optional: Adds a blur effect for better readability
            }}
          >
            <ThemeProvider theme={baselightTheme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </Box>
        ) : (
          <ThemeProvider theme={baselightTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        )}
      </body>
    </html>
  );
}

