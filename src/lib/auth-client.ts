"use client";

import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/services/auth.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const authClient = {
    signIn: {
        social: async ({ provider, callbackURL }: { provider: string, callbackURL?: string }) => {
            // Social login redirection logic
            if (provider === "google") {
                const targetUrl = callbackURL ? `${API_BASE_URL}/auth/google?callbackURL=${encodeURIComponent(callbackURL)}` : `${API_BASE_URL}/auth/google`;
                window.location.href = targetUrl;
            }
        },
        email: async ({ email, password }: any) => {
            try {
                const res = await authService.login({ email, password });
                if (!res.success) throw new Error(res.message || "Login failed");
                
                useAuthStore.getState().setUser(res.data.user);
                window.location.reload();
                return { data: res.data };
            } catch (error: any) {
                return { error };
            }
        }
    },
    signUp: {
        email: async ({ email, password, name, role }: any) => {
            try {
                const res = await authService.register({ email, password, name, role });
                if (!res.success) throw new Error(res.message || "Registration failed");
                
                useAuthStore.getState().setUser(res.data.user);
                window.location.reload();
                return { data: res.data };
            } catch (error: any) {
                return { error };
            }
        }
    },
    signOut: async () => {
        try {
            await authService.logout();
            useAuthStore.getState().logout();
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout error:", error);
        }
    }
};

export const useSession = () => {
    const { user, isLoading, setUser, setLoading } = useAuthStore();

    const fetchSession = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authService.getMe();
            if (res.success && res.data?.user) {
                setUser(res.data.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [setUser, setLoading]);

    useEffect(() => {
        if (!user && isLoading) {
            fetchSession();
        }
    }, [fetchSession, user, isLoading]);

    return { data: user ? { user } : null, isPending: isLoading, refetch: fetchSession };
};

export const { signIn, signUp, signOut } = authClient;
