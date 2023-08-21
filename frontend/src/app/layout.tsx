import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";

// components
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Context Providers
import AppContextProvider from "@/context/AppContext";

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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
      <link rel="icon" type="image/png" href="/favicon.png" />
      <body
        suppressHydrationWarning={true}
        className={`${nunito.className} overflow-x-hidden scrollbar-hide`}
      >
        <AppContextProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="px-5 mb-auto pt-7 md:pt-10 md:px-16">
              {children}
            </main>
            <Footer />
          </div>
        </AppContextProvider>
      </body>
    </html>
  );
}
