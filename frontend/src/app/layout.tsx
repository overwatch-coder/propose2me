import "./globals.css";
import type { Metadata } from "next";

// components
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Context Providers
import AppContextProvider from "@/context/AppContext";
import Script from "next/script";

export const metadata: Metadata = {
  title: "PTM - Home of everlasting happiness",
  description: "PTM Inc. Home of everlasting happiness!!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <link rel="icon" type="image/png" href="/favicon.png" />
      <Script
        src={`https://cdn.tiny.cloud/1/${process.env.TINY_MCE_API_KEY}/tinymce/6/tinymce.min.js`}
        referrerPolicy="origin"
      ></Script>

      <body className="overflow-x-hidden scrollbar-hide">
        <AppContextProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="px-5 mb-auto pt-7 md:pt-10 md:px-16 overflow-x-hidden">
              {children}
            </main>
            <Footer />
          </div>
        </AppContextProvider>
      </body>
    </html>
  );
}
