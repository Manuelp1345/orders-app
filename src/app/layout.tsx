import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orders App",
  description: "orderApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={{
        background: "#c3cfe2 ",
      }}
    >
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
