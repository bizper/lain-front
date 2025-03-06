import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../css/globals.css";
import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Lain",
    description: "A next-generation music manager.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    gsap.registerPlugin(useGSAP)

    return (
        <html lang="en" className="m-0 scrollbar-hide">
            <body
                className={`${geistSans.variable} ${geistMono.variable} m-0 antialiased max-w-[100vw] h-[100vh]`}
            >
                {children}
            </body>
        </html>
    );
}
