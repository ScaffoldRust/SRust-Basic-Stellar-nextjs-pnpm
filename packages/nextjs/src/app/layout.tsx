import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MouseMoveEffect from "@/components/mouse-move-effect";
import { Toaster } from "@/components/ui/sonner";
import { WalletProvider } from "@/context/WalletContext";
import Navbar from "@/components/navigation-menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scaffold Rust",
  description:
    "A powerful, modular, and efficient toolset for building, testing, and deploying smart contracts on the Stellar blockchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          <MouseMoveEffect />
          <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Navbar />
          </header>
          {children}
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  );
}
