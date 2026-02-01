import { StaticPageLayout } from "@/components/layout/static-page-layout";

export default function CookieSettingsPage() {
    return (
        <StaticPageLayout
            title="Cookie Settings"
            description="Manage your privacy and cookie preferences."
        >
            <div className="space-y-8 text-center py-10">
                <p className="text-lg mb-8">You can control which cookies are active during your session.</p>
                <div className="space-y-4 max-w-sm mx-auto">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <span className="font-semibold text-slate-700">Strictly Necessary</span>
                        <span className="text-sm text-primary font-bold">ALWAYS ON</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg opacity-60">
                        <span className="font-semibold text-slate-700">Analytics</span>
                        <span className="text-xs py-1 px-2 bg-slate-200 rounded">DISABLED</span>
                    </div>
                </div>
            </div>
        </StaticPageLayout>
    );
}
