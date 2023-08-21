import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";

// components
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PTM - Home of everlasting happiness",
  description: "Propose2me Inc. Home of everlasting happiness!!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <link rel="icon" type="image/png" href="/favicon.png" />
      <body className={`${nunito.className} overflow-x-hidden scrollbar-hide`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="px-5 pt-20 mb-auto md:pt-10 md:px-16">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
