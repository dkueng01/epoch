import type { Metadata } from "next";
import { Cormorant, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Epoch | Temporal Tracker",
  description: "Mark the exact moment in the future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${shareTechMono.variable}`}>
      <body className="bg-obsidian text-stardust font-serif antialiased selection:bg-neon-lime selection:text-obsidian relative min-h-screen">
        {/* Film grain overlay */}
        <div className="pointer-events-none fixed inset-0 z-50 opacity-20 mix-blend-overlay bg-noise"></div>
        {children}
      </body>
    </html>
  );
}