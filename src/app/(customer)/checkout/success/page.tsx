"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrderSuccessPage() {
    useEffect(() => {
        // Trigger confetti on mount
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                <Card className="text-center shadow-2xl border-primary/10 overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-8 pt-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                            className="flex justify-center mb-4"
                        >
                            <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <CheckCircle2 className="h-14 w-14" />
                            </div>
                        </motion.div>
                        <CardTitle className="text-3xl font-bold text-foreground">Order Placed!</CardTitle>
                        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                            Thank you for your order. We've received it and are preparing your meal.
                        </p>
                    </CardHeader>
                    <CardContent className="py-10 space-y-4">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h3 className="font-semibold text-lg mb-2">What's next?</h3>
                            <ul className="text-sm text-muted-foreground space-y-3 text-left">
                                <li className="flex items-start gap-3">
                                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[10px] font-bold">1</div>
                                    <span>The provider will confirm your order shortly.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[10px] font-bold">2</div>
                                    <span>You can track your order status in your dashboard.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[10px] font-bold">3</div>
                                    <span>We'll notify you when the rider is heading your way.</span>
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-4 pt-4 pb-10">
                        <Link href="/orders" className="w-full">
                            <Button variant="outline" className="w-full h-12 rounded-full border-2">
                                <ShoppingBag className="mr-2 h-4 w-4" /> View My Orders
                            </Button>
                        </Link>
                        <Link href="/meals" className="w-full">
                            <Button className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                Browse More Meals <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
