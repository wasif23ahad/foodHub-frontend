import { StaticPageLayout } from "@/components/layout/static-page-layout";

export default function PrivacyPage() {
    return (
        <StaticPageLayout
            title="Privacy Policy"
            description="How we protect your data and respect your privacy."
        >
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4">Data Collection</h2>
                    <p>We collect information you provide directly to us such as your name, email, and delivery address to facilitate your orders.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold mb-4">Information Security</h2>
                    <p>Your data is encrypted and stored securely. We never sell your personal information to third parties.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                    <p>You have the right to access, update, or delete your account data at any time through your profile settings.</p>
                </section>
            </div>
        </StaticPageLayout>
    );
}
