"use client";

import { createContext, useContext, useEffect, ReactNode, useCallback } from "react";
import { User, LoginCredentials, RegisterData } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/services/auth.service";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: LoginCredentials, requireRole?: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { user, setUser, isLoading, setLoading, logout: clearStore } = useAuthStore();
    const router = useRouter();

    // Check for existing session on mount
    const checkAuth = useCallback(async () => {
        setLoading(true);
        try {
            // Check for token in URL (from Google Auth redirect)
            if (typeof window !== "undefined") {
                const params = new URLSearchParams(window.location.search);
                const urlToken = params.get("token");
                const urlError = params.get("error");
                
                if (urlError) {
                    toast.error(`Authentication failed: ${urlError}`);
                    // Clean URL
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.delete("error");
                    window.history.replaceState({}, "", newUrl.toString());
                } else if (urlToken) {
                    // Save token as a first-party cookie for middleware and future requests
                    document.cookie = `token=${urlToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
                    
                    // Clean URL
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.delete("token");
                    window.history.replaceState({}, "", newUrl.toString());
                    
                    toast.success("Successfully logged in with Google");
                }
            }

            const res = await authService.getMe();
            if (res.success && res.data?.user) {
                setUser(res.data.user);
            } else {
                setUser(null);
            }
        } catch (error: any) {
            // Only log actual errors, not 401s (which just mean guest user)
            if (error.status !== 401) {
                console.error("Auth check failed:", error);
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [setUser, setLoading]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const refreshUser = async () => {
        try {
            const res = await authService.getMe();
            if (res.success && res.data?.user) {
                setUser(res.data.user);
            }
        } catch (error) {
            console.error("Refresh user failed:", error);
        }
    };

    const login = async (credentials: LoginCredentials, requireRole?: string) => {
        setLoading(true);
        try {
            const res = await authService.login(credentials);
            if (!res.success) throw new Error(res.message || "Login failed");

            const loggedInUser = res.data.user;
            const token = res.data.token;
            const userRole = (loggedInUser?.role || "").toUpperCase();

            // Strict role checking if requested
            if (requireRole && userRole !== requireRole.toUpperCase() && userRole !== "ADMIN") {
                await authService.logout();
                const portalName = requireRole.toUpperCase() === "PROVIDER" ? "Seller" : "Customer";
                toast.error(`This account is not a ${portalName} account. Please use the correct login option.`);
                throw new Error("Access denied: Insufficient permissions.");
            }

            if (token) {
                document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            }

            setUser(loggedInUser);
            toast.success("Logged in successfully");

            // Role-based redirection
            let redirectUrl = "/";
            if (userRole === "ADMIN") redirectUrl = "/admin";
            else if (userRole === "PROVIDER") redirectUrl = "/provider/dashboard";
            router.push(redirectUrl);
        } catch (error: any) {
            console.error("Login failed:", error);
            if (!error.message?.includes("Access denied")) {
                toast.error(error.message || "Invalid credentials");
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        setLoading(true);
        try {
            const res = await authService.register(data);
            if (!res.success) throw new Error(res.message || "Registration failed");

            const newUser = res.data.user;
            const token = res.data.token;
            
            if (token) {
                document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            }

            setUser(newUser);

            toast.success("Account created successfully");

            const userRole = (newUser?.role || "").toUpperCase();
            if (userRole === "PROVIDER") {
                router.push("/provider/dashboard");
            } else {
                router.push("/");
            }
        } catch (error: any) {
            console.error("Registration failed:", error);
            toast.error(error.message || "Registration failed. Please try again.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            clearStore();
            useCartStore.getState().clearCart();
            toast.success("Logged out successfully");
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Failed to logout");
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
