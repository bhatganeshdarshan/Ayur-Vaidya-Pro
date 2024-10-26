import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "./cart-context";
import { ThemeProvider } from "./themeContext";
import { UserProvider } from "./UserContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ayur Vaidya Pro",
  description: "Your Personal Medical Assistant",
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
      <UserProvider>
      <ThemeProvider>
      <CartProvider>
        {children}
        </CartProvider>
      </ThemeProvider>
      </UserProvider>
      </body>
    </html>
  );
}
