import { StaticPageLayout } from "@/components/layout/static-page-layout";

export default function CareersPage() {
    return (
        <StaticPageLayout
            title="Careers"
            description="Join our talented team and build the future of food."
        >
            <div className="space-y-8 text-center py-10">
                <h2 className="text-3xl font-bold mb-4">We're Hiring!</h2>
                <p className="text-lg text-slate-600 mb-8">Want to help build the best food platform? We're looking for passionate designers, developers, and operations experts.</p>
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-semibold">Drop your resume at:</p>
                    <a href="mailto:careers@foodhub.com" className="text-primary hover:underline">careers@foodhub.com</a>
                </div>
            </div>
        </StaticPageLayout>
    );
}
