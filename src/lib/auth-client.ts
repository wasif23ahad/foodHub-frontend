"use client";

import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const authClient = {
    signIn: {
        social: async ({ provider }: { provider: string }) => {
            if (provider === "google") {
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
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Login failed");
                window.location.reload();
                return { data };
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
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Registration failed");
                window.location.reload();
                return { data };
            } catch (error: any) {
                return { error };
            }
        }
    },
    signOut: async () => {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST" });
            window.location.href = "/login";
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
            const res = await fetch(`${API_BASE_URL}/auth/get-session`);
            if (res.ok) {
                const data = await res.json();
                setSession(data);
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
