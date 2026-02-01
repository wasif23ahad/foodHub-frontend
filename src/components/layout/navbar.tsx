"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/meals", label: "Meals" },
];

export function Navbar() {
    const pathname = usePathname();

    // TODO: Replace with actual cart count from Zustand store
    const cartItemCount = 0;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                        <UtensilsCrossed className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-foreground">
                        Food<span className="text-primary">Hub</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === link.href
                                    ? "text-foreground border-b-2 border-primary pb-1"
                                    : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Side - Cart & Auth */}
                <div className="flex items-center gap-4">
                    {/* Cart */}
                    <Link href="/cart" className="relative">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {cartItemCount > 0 && (
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                                    {cartItemCount}
                                </Badge>
                            )}
                        </Button>
                    </Link>

                    {/* Sign In Button - Desktop */}
                    <Link href="/login" className="hidden md:block">
                        <Button className="bg-primary hover:bg-primary-dark text-white">
                            Sign In
                        </Button>
                    </Link>

                    {/* Mobile Menu - Sheet */}
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                        <UtensilsCrossed className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-lg font-bold">
                                        Food<span className="text-primary">Hub</span>
                                    </span>
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="mt-8 flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "text-lg font-medium transition-colors hover:text-primary py-2 border-b border-border/40",
                                            pathname === link.href
                                                ? "text-primary"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Link href="/login" className="mt-4">
                                    <Button className="w-full bg-primary hover:bg-primary-dark text-white">
                                        Sign In
                                    </Button>
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
