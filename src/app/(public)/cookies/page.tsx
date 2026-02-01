import { StaticPageLayout } from "@/components/layout/static-page-layout";

export default function CookiesPage() {
    return (
        <StaticPageLayout
            title="Cookie Policy"
            description="How we use cookies to improve your experience."
        >
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4">What are Cookies?</h2>
                    <p>Cookies are small text files stored on your device that help us remember your preferences and keep you logged in.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold mb-4">Types of Cookies</h2>
                    <p>We use essential cookies for authentication and performance cookies to understand how you use our site.</p>
                </section>
            </div>
        </StaticPageLayout>
    );
}
