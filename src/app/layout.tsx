import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RootProvider } from "@/components/providers/root-provider";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/animations/page-transition";
import { CravelyDock } from "@/components/ai/cravely-dock";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-geist-sans",
});

export const metadata: Metadata = {
    title: "FoodHub - Delicious Meals Delivered",
    description: "Order your favorite meals from top local providers.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
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
                        <CravelyDock />
                    </div>
                </RootProvider>
            </body>
        </html>
    );
}
