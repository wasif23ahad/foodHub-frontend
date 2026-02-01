import { StaticPageLayout } from "@/components/layout/static-page-layout";

export default function TermsPage() {
    return (
        <StaticPageLayout
            title="Terms of Service"
            description="Our guidelines for a great community experience."
        >
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
                    <p>By using FoodHub, you agree to these terms. Please read them carefully.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
                    <p>You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold mb-4">Termination</h2>
                    <p>We reserve the right to suspend or terminate accounts that violate our community standards or terms of service.</p>
                </section>
            </div>
        </StaticPageLayout>
    );
}
