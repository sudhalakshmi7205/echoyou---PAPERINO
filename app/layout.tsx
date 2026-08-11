import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300","400","500","600","700","800"],
});

export const metadata: Metadata = {
  title: "EchoYou - AI Interview Platform",
  description: "Master your next technical interview with a senior-level AI interviewer.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
