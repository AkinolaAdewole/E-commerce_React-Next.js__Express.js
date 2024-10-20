import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic"; 
import Footer from "../components/Footer";
import { WixClientContextProvider } from "../context/wixContext";
import { createContext, useContext, useState } from 'react';

// Dynamic import of Navbar to prevent SSR issues
const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Akinola Adewole",
  description: "A complete e-commerce application with Next.js and Wix",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <WixClientContextProvider> */}
          <Navbar />
          {children}
          <Footer />
        {/* </WixClientContextProvider> */}
      </body>
    </html>
  );
}
