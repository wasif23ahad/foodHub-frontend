"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, MapPin, Phone, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useCartStore } from "@/stores/cart-store";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider"; // Assuming this exports the hook

const checkoutSchema = z.object({
    address: z.string().min(5, "Address is required (min 5 characters)"),
    phone: z.string().min(10, "Phone number is required"),
    notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            address: "",
            phone: "",
            notes: "",
        },
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Redirect if cart is empty
    useEffect(() => {
        if (mounted && items.length === 0) {
            router.push("/cart");
        }
    }, [mounted, items, router]);

    // Redirect if not logged in
    useEffect(() => {
        if (!isAuthLoading && !user) {
            toast.error("Please login to proceed with checkout");
            router.push(`/login?redirect=/checkout`);
        }
    }, [isAuthLoading, user, router]);

    const subtotal = getTotalPrice();
    const deliveryFee = 60;
    const total = subtotal + deliveryFee;

    const onSubmit = async (data: CheckoutFormValues) => {
        setIsSubmitting(true);
        try {
            // Prepare order payload
            // Assuming we process the order for the first provider found if multiple, 
            // or expecting backend to handle it. For now, simple payload.

            // MVP: We'll send the providerId from the first item. 
            // Ideally, we should group by provider or block mixed carts.
            // Backend derives provider from meal IDs

            const payload = {
                items: items.map(item => ({
                    mealId: item.id,
                    quantity: item.quantity
                })),
                deliveryAddress: `${data.address} (Phone: ${data.phone})`,
                deliveryNotes: data.notes,
            };

            const res = await api.post<{ data: { id: string } }>("/orders", payload);

            toast.success("Order placed successfully!");
            clearCart();
            router.push(`/checkout/success?orderId=${res.data.id}`); // Redirect to success page with ID
        } catch (error: any) {
            console.error("Checkout error:", error);
            toast.error(error.message || "Failed to place order");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted || isAuthLoading) {
        return <div className="min-h-screen container mx-auto px-4 py-8">Loading...</div>;
    }

    if (items.length === 0) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Checkout Form */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" /> Address
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter your full delivery address..."
                                                        className="resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4" /> Phone Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="017..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="notes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <MessageSquare className="h-4 w-4" /> Order Notes
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Any special instructions? (Optional)" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Mobile/Tablet Submit Button here or stick to bottom? */}
                                    {/* We will use the Summary card for the main action */}
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div>
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>৳ {(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>৳ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Delivery Fee</span>
                                    <span>৳ {deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Total</span>
                                    <span className="text-primary">৳ {total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full text-lg py-6"
                                onClick={form.handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Place Order"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
