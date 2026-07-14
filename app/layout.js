import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SessionWrapper";
import PageShell from "@/components/PageShell";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sahayak",
  description: "Helping hands",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} font-sans min-h-screen bg-white text-[#1A1A1A] antialiased overflow-x-hidden flex flex-col`}
      >
        <SessionWrapper>
          <PageShell>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </PageShell>
        </SessionWrapper>
      </body>
    </html>
  );
}

