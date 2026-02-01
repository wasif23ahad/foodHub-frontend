import { StaticPageLayout } from "@/components/layout/static-page-layout";

export default function NewsroomPage() {
    return (
        <StaticPageLayout
            title="Newsroom"
            description="The latest updates, press releases, and stories from FoodHub."
        >
            <div className="space-y-10">
                {[1, 2, 3].map((i) => (
                    <article key={i} className="group">
                        <div className="text-sm text-primary font-semibold mb-2">February {i + 10}, 2025</div>
                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors cursor-pointer mb-3">
                            FoodHub expands to 5 new cities!
                        </h3>
                        <p className="text-slate-600">We are thrilled to announce that our services are now available in even more neighborhoods, bringing fresh meals to thousands of new customers...</p>
                    </article>
                ))}
            </div>
        </StaticPageLayout>
    );
}
