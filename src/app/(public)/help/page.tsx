import { StaticPageLayout } from "@/components/layout/static-page-layout";

export default function HelpPage() {
    return (
        <StaticPageLayout
            title="Help Center"
            description="Everything you need to know about using FoodHub."
        >
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4">Ordering Food</h2>
                    <p>To order food, simply browse our meals, add them to your cart, and proceed to checkout. You will receive real-time updates on your order status.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
                    <p>We accept all major credit cards, digital wallets, and cash on delivery in selected areas.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold mb-4">Delivery Issues</h2>
                    <p>If your order is late or incorrect, please reach out to us via the contact form or our live chat support available 24/7.</p>
                </section>
            </div>
        </StaticPageLayout>
    );
}
