"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, UtensilsCrossed, User as UserIcon, LayoutDashboard, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { useCartStore } from "@/stores/cart-store";
import { useAuth } from "@/components/providers/auth-provider";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/meals", label: "Meals" },
];

export function Navbar() {
    const pathname = usePathname();
    const cartItems = useCartStore((state) => state.items);
    const { user, isLoading, logout } = useAuth();
    const [mounted, setMounted] = useState(false);

    // Hydration fix
    useEffect(() => {
        setMounted(true);
    }, []);

    const cartItemCount = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"
                    >
                        <UtensilsCrossed className="h-5 w-5 text-white" />
                    </motion.div>
                    <span className="text-xl font-bold text-foreground">
                        Food<span className="text-primary">Hub</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary relative py-1",
                                    isActive ? "text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {link.label}
                                {isActive && (
                                    <motion.span
                                        layoutId="nav-underline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Side - Cart & Auth */}
                <div className="flex items-center gap-2 md:gap-4">
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

                    {/* Auth Section */}
                    {mounted && !isLoading && (
                        <>
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-border/50">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.image} alt={user.name} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <Link href="/profile">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <UserIcon className="mr-2 h-4 w-4" />
                                                    <span>Profile</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link href="/orders">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Package className="mr-2 h-4 w-4" />
                                                    <span>My Orders</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            {/* Role Based Dashboards */}
                                            {user.role === "admin" && (
                                                <Link href="/admin">
                                                    <DropdownMenuItem className="cursor-pointer text-primary">
                                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                                        <span>Admin Dashboard</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                            )}
                                            {user.role === "provider" && (
                                                <Link href="/provider/dashboard">
                                                    <DropdownMenuItem className="cursor-pointer text-primary">
                                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                                        <span>Provider Dashboard</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                            )}
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50" onClick={() => logout()}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href="/login" className="hidden md:block">
                                    <Button className="bg-primary hover:bg-primary-dark text-white rounded-full px-6">
                                        Sign In
                                    </Button>
                                </Link>
                            )}
                        </>
                    )}

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

                                {mounted && (
                                    <>
                                        {user ? (
                                            <>
                                                <div className="py-4 px-2 bg-slate-50 rounded-lg mt-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={user.image} alt={user.name} />
                                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                                {getInitials(user.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold">{user.name}</span>
                                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Link href="/profile" className="text-lg font-medium py-2 border-b">Profile</Link>
                                                <Link href="/orders" className="text-lg font-medium py-2 border-b">My Orders</Link>
                                                {user.role === "admin" && (
                                                    <Link href="/admin" className="text-lg font-medium py-2 border-b text-primary">Admin Dashboard</Link>
                                                )}
                                                {user.role === "provider" && (
                                                    <Link href="/provider/dashboard" className="text-lg font-medium py-2 border-b text-primary">Provider Dashboard</Link>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    className="justify-start px-0 text-lg font-medium text-red-500 hover:text-red-600 hover:bg-transparent"
                                                    onClick={() => logout()}
                                                >
                                                    <LogOut className="mr-2 h-5 w-5" /> Log out
                                                </Button>
                                            </>
                                        ) : (
                                            <Link href="/login" className="mt-4">
                                                <Button className="w-full bg-primary hover:bg-primary-dark text-white rounded-full py-6 text-lg">
                                                    Sign In
                                                </Button>
                                            </Link>
                                        )}
                                    </>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
