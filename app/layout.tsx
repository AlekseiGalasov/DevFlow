import type {Metadata} from "next";
import localFont from "next/font/local";
import React, {ReactNode} from "react";

import "./globals.css";
import ThemeProvider from "@/app/context/Theme";
import {Toaster} from "@/components/ui/toaster";
import {SessionProvider} from "next-auth/react";
import {auth} from "@/auth";

const inter = localFont({
    src: "./fonts/Inter.ttf",
    variable: "--font-inter",
    weight: "100 200 300 400 500 700 800 900",
});

const spaceGrotesk = localFont({
    src: "./fonts/SpaceGrotesk.ttf",
    variable: "--font-space-grotesk",
    weight: "300 400 500 700",
});

export const metadata: Metadata = {
    title: "DevFlow",
    description: "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
    icons: {
        icon: "/images/site-logo.svg",
    }

};

const RootLayout = async ({children}: {children: ReactNode}) => {

    const session = await auth()

    return (
        <html suppressHydrationWarning lang="en">
        <SessionProvider session={session}>
            <body
                className={`${inter.className} ${spaceGrotesk.variable} antialiased`}
            >
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
                <Toaster/>
            </ThemeProvider>
            </body>
        </SessionProvider>
        </html>
    );
}
export default RootLayout