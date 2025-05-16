// app/layout.tsx
import { ReactNode } from "react";
import ClientWrapper from "../app/(DashboardLayout)/components/ClientWrapper";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
