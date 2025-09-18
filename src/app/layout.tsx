import { ReactNode } from "react";
import ClientWrapper from "../app/(DashboardLayout)/components/ClientWrapper";
import "./styles/common.css";
import "./global.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Connect India Enterprises</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/logos/smallLogo.png" />
      </head>
      <body>
        <ClientWrapper >{children}</ClientWrapper>
      </body>
    </html>
  );
}
