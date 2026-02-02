"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShieldAlert, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

// Validation Schema
const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid admin email" }),
    password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
    const { login, isLoading, logout } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: LoginFormValues) {
        try {
            await login(data, "ADMIN");
        } catch (error: any) {
            // Managed by AuthProvider toast
        }
    }

    return (
        <div className="flex bg-slate-900 min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute top-8 left-8">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                        <UtensilsCrossed className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">
                        Food<span className="text-primary">Hub</span>
                    </span>
                </Link>
            </div>

            <Card className="w-full max-w-md shadow-2xl border-slate-800 bg-slate-950 text-slate-50">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-red-500/10 rounded-full">
                            <ShieldAlert className="h-10 w-10 text-red-500" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-extrabold tracking-tight text-center text-white">
                        Admin Access
                    </CardTitle>
                    <CardDescription className="text-center text-slate-400">
                        Authorized personnel only. Please sign in to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Admin Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="admin@foodhub.com"
                                                {...field}
                                                className="bg-slate-900 border-slate-700 text-white focus-visible:ring-red-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className="pr-10 bg-slate-900 border-slate-700 text-white focus-visible:ring-red-500"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    "Secure Sign In"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 text-center pb-8">
                    <div className="text-xs text-slate-500">
                        Unauthorized access attempts are logged and monitored.
                    </div>
                    <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                        Not an admin? Use regular login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
