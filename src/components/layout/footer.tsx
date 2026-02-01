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
        <footer className="bg-secondary text-secondary-foreground">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                                <UtensilsCrossed className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                Food<span className="text-primary">Hub</span>
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Discover and order delicious meals from the best local providers.
                            Fresh, fast, and always satisfying.
                        </p>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Support</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className="my-8 bg-gray-700" />

                {/* Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} FoodHub. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">Made with ❤️ for food lovers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
