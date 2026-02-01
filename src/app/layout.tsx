import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for a clean modern look
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RootProvider } from "@/components/providers/root-provider";
import { cn } from "@/lib/utils";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-geist-sans", // Mapping to the existing variable in globals.css
});

export const metadata: Metadata = {
    title: "FoodHub - Delicious Meals Delivered",
    description: "Order your favorite meals from top local providers.",
};

import { PageTransition } from "@/components/animations/page-transition";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={cn(
                "min-h-screen bg-background font-sans antialiased",
                inter.variable
            )}>
                <RootProvider>
                    <div className="relative flex min-h-screen flex-col">
                        <Navbar />
                        <main className="flex-1">
                            <PageTransition>
                                {children}
                            </PageTransition>
                        </main>
                        <Footer />
                    </div>
                </RootProvider>
            </body>
        </html>
    );
}
