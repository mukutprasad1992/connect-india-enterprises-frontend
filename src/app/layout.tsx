import { ReactNode } from "react";
import ClientWrapper from "./ClientWrapper";
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
