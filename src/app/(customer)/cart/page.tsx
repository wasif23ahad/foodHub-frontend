"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { useEffect, useState } from "react";
import { getMediaUrl } from "@/lib/utils";

export default function CartPage() {
    const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
    const [mounted, setMounted] = useState(false);

    // Hydration fix
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen container mx-auto px-4 py-8">Loading cart...</div>;
    }

    const subtotal = getTotalPrice();
    const deliveryFee = 60; // Fixed delivery fee for now
    const total = subtotal + (items.length > 0 ? deliveryFee : 0);

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="bg-muted/50 p-6 rounded-full mb-6">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
                <p className="text-muted-foreground mb-8 max-w-sm">
                    Looks like you haven't added any meals to your cart yet. Browse our delicious menu to get started!
                </p>
                <Link href="/meals">
                    <Button size="lg">Browse Meals</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex flex-col sm:flex-row gap-4">
                                    {/* Item Image */}
                                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                                        {item.image ? (
                                            <Image
                                                src={getMediaUrl(item.image)}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-xs">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.provider?.name}
                                                </p>
                                            </div>
                                            <p className="font-bold">৳ {(item.price * item.quantity).toFixed(2)}</p>
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-4 text-center text-sm font-medium">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            {/* Remove Button */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                <span className="text-xs">Remove</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-muted/30 p-4 border-t flex justify-between items-center">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-card border rounded-xl shadow-sm p-6 sticky top-24">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>৳ {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Delivery Fee</span>
                                <span>৳ {deliveryFee.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-primary">৳ {total.toFixed(2)}</span>
                            </div>
                        </div>

                        <Link href="/checkout" className="w-full">
                            <Button className="w-full gap-2 text-lg py-6 shadow-lg shadow-primary/20">
                                Proceed to Checkout
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>

                        <div className="mt-6 text-center">
                            <Link href="/meals" className="text-sm text-primary hover:underline">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
