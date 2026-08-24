import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
  fallback: ["system-ui", "sans-serif"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300","400","500","600","700","800"],
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://echoyou-paperino.vercel.app'),
  title: {
    default: "EchoYou - AI Mock Interviews & Resume Intelligence",
    template: "%s | EchoYou AI",
  },
  description: "Master technical, behavioral, and resume follow-up AI interviews with real-time feedback, detailed scorecards, and AI roadmap guidance.",
  keywords: ["AI interview", "mock interview", "resume analysis", "ATS score", "technical interview practice", "coding interview", "Groq AI"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://echoyou-paperino.vercel.app",
    title: "EchoYou - AI Mock Interviews & Resume Intelligence",
    description: "Practice real-time technical, behavioral, and resume follow-up AI interviews with instant feedback and scorecards.",
    siteName: "EchoYou AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoYou - AI Mock Interviews & Resume Intelligence",
    description: "Master technical, behavioral, and resume follow-up AI interviews with real-time feedback and detailed scorecards.",
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
