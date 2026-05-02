"use client";

import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const authClient = {
    signIn: {
        social: async ({ provider }: { provider: string }) => {
            if (provider === "google") {
                // For manual JWT, we typically redirect to a backend route that initiates Google OAuth
                // or use a frontend library to get an idToken.
                window.location.href = `${API_BASE_URL}/auth/google`;
            }
        },
        email: async ({ email, password }: any) => {
            try {
                const res = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
                const result = await res.json();
                if (!res.ok || !result.success) {
                    throw new Error(result.message || "Login failed");
                }
                
                // Persistence is handled by the HttpOnly cookie set by the backend
                window.location.reload();
                return { data: result.data };
            } catch (error: any) {
                return { error };
            }
        }
    },
    signUp: {
        email: async ({ email, password, name, role }: any) => {
            try {
                const res = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, name, role }),
                });
                const result = await res.json();
                if (!res.ok || !result.success) {
                    throw new Error(result.message || "Registration failed");
                }
                
                window.location.reload();
                return { data: result.data };
            } catch (error: any) {
                return { error };
            }
        }
    },
    signOut: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST" });
            const result = await res.json();
            if (result.success) {
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    }
};

export const useSession = () => {
    const [session, setSession] = useState<{ user: any } | null>(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchSession = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/me`);
            if (res.ok) {
                const result = await res.json();
                if (result.success && result.data?.user) {
                    setSession({ user: result.data.user });
                } else {
                    setSession(null);
                }
            } else {
                setSession(null);
            }
        } catch (err) {
            setError(err);
            setSession(null);
        } finally {
            setIsPending(false);
        }
    }, []);

    useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    return { data: session, isPending, error, refetch: fetchSession };
};

export const { signIn, signUp, signOut } = authClient;
