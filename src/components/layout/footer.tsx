import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
    support: [
        { href: "/help", label: "Help Center" },
        { href: "/safety", label: "Safety" },
        { href: "/refund-policy", label: "Refund Policy" },
    ],
    company: [
        { href: "/about", label: "About Us" },
        { href: "/providers", label: "Become a Provider" },
        { href: "/careers", label: "Careers" },
    ],
    legal: [
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
        { href: "/cookies", label: "Cookie Policy" },
    ],
};

export function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-300">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Logo & Description */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                                <UtensilsCrossed className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-bold text-white">
                                Food<span className="text-primary">Hub</span>
                            </span>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            Bringing the world's most delicious cuisines straight to your doorstep.
                            Gourmet meals, exceptional speed.
                        </p>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-bold text-primary uppercase tracking-wider mb-6">Support</h3>
                        <ul className="space-y-4">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            {/* Adding FAQ from screenshot */}
                            <li>
                                <Link href="/faq" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-bold text-primary uppercase tracking-wider mb-6">Company</h3>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/newsroom" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    Newsroom
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-bold text-primary uppercase tracking-wider mb-6">Legal</h3>
                        <ul className="space-y-4">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/cookie-settings" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    Cookie Settings
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-10 bg-slate-800" />

                {/* Copyright */}
                <div className="text-center">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} FoodHub. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
