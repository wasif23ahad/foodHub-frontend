import { StaticPageLayout } from "@/components/layout/static-page-layout";

export default function SafetyPage() {
    return (
        <StaticPageLayout
            title="Community Safety"
            description="Your safety is our top priority."
        >
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4">Food Standards</h2>
                    <p>All providers on FoodHub must adhere to high hygiene standards and pass regular health inspections.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold mb-4">Secure Deliveries</h2>
                    <p>Our delivery partners are trained to handle food safely and we offer contactless delivery options for your peace of mind.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold mb-4">Reporting Issues</h2>
                    <p>If you encounter any safety concerns, please report them immediately via our support team.</p>
                </section>
            </div>
        </StaticPageLayout>
    );
}
