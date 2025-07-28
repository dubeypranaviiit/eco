"use client";

import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
        <ClerkProvider>
         
        <html lang="en">
      <body className="flex flex-col min-h-screen w-screen">
    
           <Navbar />
        <main className="flex-grow">
          {children}
        </main>
      
       
       <Footer />
      </body>
    </html>
     </ClerkProvider>
  );
}
