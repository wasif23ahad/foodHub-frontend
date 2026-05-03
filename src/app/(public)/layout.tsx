import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CravelyDock } from "@/components/ai/cravely-dock";
import { PageTransition } from "@/components/animations/page-transition";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
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
    );
}
