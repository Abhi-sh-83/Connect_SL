import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "ConnectSL | Smart Transit Desk",
  description:
    "AI-powered smart service request platform for commuters, operators, and transit support teams."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable)}>
        {children}
      </body>
    </html>
  );
}
