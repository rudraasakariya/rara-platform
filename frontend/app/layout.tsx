import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/layout/navbar";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { ErrorBoundaryWrapper } from "@/components/layout/error-boundary-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RARA Platform",
  description: "RARA Tutoring Platform - Student and Tutor Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ErrorBoundaryWrapper>
            <AuthProvider>
              <Navbar />
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
              <Toaster />
            </AuthProvider>
          </ErrorBoundaryWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
