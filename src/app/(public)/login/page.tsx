"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Eye, EyeOff, Loader2, User, Utensils, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { DemoLoginPanel } from "@/components/auth/demo-login-panel";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginRole, setLoginRole] = useState<"user" | "seller" | "admin">("user");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues, overrideRole?: "user" | "seller" | "admin") {
    try {
      const activeRole = overrideRole || loginRole;
      let requireRole: "CUSTOMER" | "PROVIDER" | "ADMIN" = "CUSTOMER";
      if (activeRole === "seller") requireRole = "PROVIDER";
      if (activeRole === "admin") requireRole = "ADMIN";
      
      await login(data, requireRole);
    } catch {
      // Error handling is done in AuthProvider
    }
  }

  const handleDemoSelect = (email: string, password: string, role: "user" | "seller" | "admin") => {
    form.setValue("email", email, { shouldValidate: true });
    form.setValue("password", password, { shouldValidate: true });
    setLoginRole(role);
    
    // Auto-submit for better UX
    setTimeout(() => {
        form.handleSubmit((data) => onSubmit(data, role))();
    }, 150);
  };

  const handleGoogleLogin = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/`,
    });
  };

  return (
    <div className="flex bg-slate-50 dark:bg-background min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <Card className="w-full max-w-md shadow-lg border-none sm:border-border overflow-hidden">
        <CardHeader className="space-y-1 bg-white dark:bg-card">
          <CardTitle className="text-2xl font-bold tracking-tight text-center text-primary">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white dark:bg-card pt-6">
          <div className="mb-6 space-y-4">
            <Button 
              variant="outline" 
              className="w-full gap-2 font-semibold hover:bg-slate-50 dark:hover:bg-accent transition-colors"
              onClick={handleGoogleLogin}
              type="button"
            >
              <Icons.google className="h-4 w-4" />
              Continue with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-card px-2 text-slate-500 font-medium">
                  Or continue with email
                </span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => onSubmit(data))} className="space-y-5">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Sign in as</Label>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="relative">
                    <input
                      id="login-role-user"
                      type="radio"
                      className="peer sr-only"
                      checked={loginRole === "user"}
                      onChange={() => setLoginRole("user")}
                      name="loginRole"
                    />
                    <Label
                      htmlFor="login-role-user"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 sm:p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary peer-checked:text-primary cursor-pointer transition-all"
                    >
                      <User className="mb-2 h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="font-semibold text-[10px] sm:text-xs">Customer</span>
                    </Label>
                  </div>
                  <div className="relative">
                    <input
                      id="login-role-seller"
                      type="radio"
                      className="peer sr-only"
                      checked={loginRole === "seller"}
                      onChange={() => setLoginRole("seller")}
                      name="loginRole"
                    />
                    <Label
                      htmlFor="login-role-seller"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 sm:p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary peer-checked:text-primary cursor-pointer transition-all"
                    >
                      <Utensils className="mb-2 h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="font-semibold text-[10px] sm:text-xs">Seller</span>
                    </Label>
                  </div>
                  <div className="relative">
                    <input
                      id="login-role-admin"
                      type="radio"
                      className="peer sr-only"
                      checked={loginRole === "admin"}
                      onChange={() => setLoginRole("admin")}
                      name="loginRole"
                    />
                    <Label
                      htmlFor="login-role-admin"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 sm:p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary peer-checked:text-primary cursor-pointer transition-all"
                    >
                      <ShieldCheck className="mb-2 h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="font-semibold text-[10px] sm:text-xs">Admin</span>
                    </Label>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} className="bg-slate-50/50 dark:bg-background/50" />
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10 bg-slate-50/50 dark:bg-background/50"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark font-bold py-6 text-white text-lg shadow-md shadow-primary/20 transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  `Sign In as ${loginRole === "seller" ? "Seller" : loginRole === "admin" ? "Admin" : "Customer"}`
                )}
              </Button>
            </form>
          </Form>

          <DemoLoginPanel onSelect={handleDemoSelect} />
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center bg-slate-50/50 dark:bg-accent/10 border-t py-6">
          <div className="text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-bold">
              Sign up for free
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
