import { StaticPageLayout } from "@/components/layout/static-page-layout";

export default function RefundPolicyPage() {
    return (
        <StaticPageLayout
            title="Refund Policy"
            description="Clear guidelines on refunds and adjustments."
        >
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4">Eligibility for Refunds</h2>
                    <p>Refunds are typically issued if the food arrived damaged, was incorrect, or if the order was never delivered.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold mb-4">Process Time</h2>
                    <p>Once approved, refunds are processed within 3-5 business days back to your original payment method.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold mb-4">Store Credit</h2>
                    <p>In many cases, we can offer instant FoodHub store credit as an alternative to a bank refund.</p>
                </section>
            </div>
        </StaticPageLayout>
    );
}
