import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shipday — Dispatch Settings",
  description: "Shipday dispatch settings page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
