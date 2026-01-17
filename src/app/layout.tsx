import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dr. Priyanka's Naturopathy Clinic",
  description: "Holistic wellness through yoga, hydrotherapy, diet, and natural therapies in Vadodara",
};
import { AuthProvider } from "@/context/AuthContext";
import AIChatWidget from "@/components/AIChatWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body
        className={`${playfair.variable} ${inter.variable} ${cormorant.variable} antialiased font-sans`}
      >
        <AuthProvider>
          {children}
          <AIChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
