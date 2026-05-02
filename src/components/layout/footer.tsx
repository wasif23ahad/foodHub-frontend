import Link from "next/link";
import { UtensilsCrossed, Facebook, Twitter, Instagram, Github, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
    support: [
        { href: "/help", label: "Help Center" },
        { href: "/help#safety", label: "Safety" },
        { href: "/help#refunds", label: "Refund Policy" },
        { href: "/help#faq", label: "FAQ" },
    ],
    company: [
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact" },
        { href: "/register?role=PROVIDER", label: "Become a Provider" },
        { href: "/cravely", label: "Cravely AI" },
    ],
    legal: [
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms of Service" },
    ],
};

export function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-300 border-t border-white/5">
            <div className="container mx-auto px-4 pt-20 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Logo & Info */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                                <UtensilsCrossed className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tight">
                                Food<span className="text-primary">Hub</span>
                            </span>
                        </Link>
                        <p className="text-base text-slate-400 leading-relaxed max-w-xs">
                            Experience the future of food delivery with AI-powered recommendations and gourmet local kitchens.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-900 border border-white/5 hover:bg-primary hover:text-white transition-all">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-900 border border-white/5 hover:bg-primary hover:text-white transition-all">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-900 border border-white/5 hover:bg-primary hover:text-white transition-all">
                                <Instagram className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-tight">Company</h3>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-slate-400 hover:text-primary transition-colors font-medium">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-tight">Support</h3>
                        <ul className="space-y-4">
                            {footerLinks.support.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-slate-400 hover:text-primary transition-colors font-medium">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-tight">Contact Us</h3>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-slate-400 font-medium">123 Culinary Ave, <br />Gourmet District, NY 10001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-slate-400 font-medium">+1 (555) 000-FOOD</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-slate-400 font-medium">hello@foodhub.app</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="bg-white/10 mb-8" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-slate-500 font-medium">
                        © {new Date().getFullYear()} FoodHub AI. Built with ❤️ for food lovers.
                    </p>
                    <div className="flex items-center gap-8">
                        {footerLinks.legal.map((link) => (
                            <Link key={link.label} href={link.href} className="text-sm text-slate-500 hover:text-white transition-colors font-medium">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
