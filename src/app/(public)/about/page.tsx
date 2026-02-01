import { StaticPageLayout } from "@/components/layout/static-page-layout";

export default function AboutPage() {
    return (
        <StaticPageLayout
            title="About Us"
            description="Our journey to revolutionize food delivery."
        >
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p>At FoodHub, we believe great food should be accessible to everyone, everywhere. We connect local chefs and restaurants with food lovers using cutting-edge technology.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold mb-4">The Story</h2>
                    <p>Founded in 2024, FoodHub started as a small project to help local home chefs reach more customers. Today, we are proud to support thousands of providers across the country.</p>
                </section>
            </div>
        </StaticPageLayout>
    );
}
