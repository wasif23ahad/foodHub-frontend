import { StaticPageLayout } from "@/components/layout/static-page-layout";

export default function FAQPage() {
    const faqs = [
        { q: "How fast is delivery?", a: "Most orders arrive within 30-45 minutes depending on your location." },
        { q: "Can I cancel my order?", a: "Yes, you can cancel before the restaurant starts preparing your food." },
        { q: "Do you have gluten-free options?", a: "Absolutely! Many of our providers offer gluten-free and vegan alternatives. Use the search filters to find them." },
        { q: "How do I become a provider?", a: "Click on 'Become a Provider' in the footer and sign up for a provider account." }
    ];

    return (
        <StaticPageLayout
            title="Frequently Asked Questions"
            description="Quick answers to common questions."
        >
            <div className="space-y-6">
                {faqs.map((faq, i) => (
                    <div key={i} className="border-b border-slate-100 pb-6 last:border-0">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{faq.q}</h3>
                        <p className="text-slate-600">{faq.a}</p>
                    </div>
                ))}
            </div>
        </StaticPageLayout>
    );
}
