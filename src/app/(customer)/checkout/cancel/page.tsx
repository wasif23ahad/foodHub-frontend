"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutCancelPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <Card className="text-center shadow-xl border-amber-100">
                    <CardHeader className="bg-amber-50/50 pb-8 pt-10">
                        <div className="flex justify-center mb-4">
                            <div className="h-20 w-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                <AlertCircle className="h-10 w-10" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-foreground">Payment Cancelled</CardTitle>
                    </CardHeader>
                    <CardContent className="py-6 space-y-4">
                        <p className="text-muted-foreground">
                            You have cancelled the payment process. Your order has not been placed.
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3 pb-8">
                        <Link href="/checkout" className="w-full">
                            <Button className="w-full h-12 rounded-full">
                                Back to Checkout
                            </Button>
                        </Link>
                        <Link href="/cart" className="w-full">
                            <Button variant="outline" className="w-full h-12 rounded-full">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Return to Cart
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
