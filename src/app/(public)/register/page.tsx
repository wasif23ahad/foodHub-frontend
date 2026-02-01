"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, User, Utensils } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Validation Schema
const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["user", "provider"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
    const { register: registerUser, isLoading } = useAuth(); // Renaming to avoid conflict with hook form register

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "user",
        },
    });

    async function onSubmit(data: RegisterFormValues) {
        try {
            await registerUser({
                ...data,
                role: data.role === "user" ? "customer" : "provider", // Ensure type match
            });
        } catch (error) {
            // Error handling is in AuthProvider
        }
    }

    return (
        <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-lg border-none sm:border-border">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center text-primary">
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Join FoodHub to order or sell delicious meals
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Role Selection */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">I want to...</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        id="role-user"
                                        type="radio"
                                        value="user"
                                        className="peer sr-only"
                                        {...register("role")}
                                    />
                                    <Label
                                        htmlFor="role-user"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary peer-checked:text-primary cursor-pointer transition-all"
                                    >
                                        <User className="mb-2 h-6 w-6" />
                                        <span className="font-semibold">Order Food</span>
                                    </Label>
                                </div>
                                <div>
                                    <input
                                        id="role-provider"
                                        type="radio"
                                        value="provider"
                                        className="peer sr-only"
                                        {...register("role")}
                                    />
                                    <Label
                                        htmlFor="role-provider"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary peer-checked:text-primary cursor-pointer transition-all"
                                    >
                                        <Utensils className="mb-2 h-6 w-6" />
                                        <span className="font-semibold">Sell Food</span>
                                    </Label>
                                </div>
                            </div>
                            {errors.role && (
                                <p className="text-sm text-destructive">{errors.role.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" {...register("name")} />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder="name@example.com" {...register("email")} />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
                            <p className="text-xs text-muted-foreground">
                                Must be at least 6 characters long
                            </p>
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full bg-primary hover:bg-primary-dark font-bold relative mt-2" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="absolute left-4 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 text-center">
                    <div className="text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline font-semibold">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
