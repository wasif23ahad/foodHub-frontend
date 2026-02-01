"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, LoginCredentials, RegisterData } from "@/types";
import { api, API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    signInWithGoogle: () => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const session = await api.get<{ user: User } | null>("/auth/get-session");
                if (session?.user) {
                    setUser(session.user);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                // Fail silently, user just isn't logged in
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const res = await api.post<{ user: User; token?: string }>("/auth/sign-in/email", credentials);
            const user = res.user || res;
            setUser(user as User);
            toast.success("Logged in successfully");
            router.push("/");
        } catch (error: any) {
            console.error("Login failed:", error);
            toast.error(error.message || "Invalid credentials");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        setIsLoading(true);
        try {
            const res = await api.post<{ user: User }>("/auth/sign-up/email", {
                email: data.email,
                password: data.password,
                name: data.name,
                role: data.role.toUpperCase() // BetterAuth expects uppercase ROLES usually or matches what we defined in backend
            });

            const user = res.user || res;
            setUser(user as User);

            toast.success("Account created successfully");
            router.push("/");
        } catch (error: any) {
            console.error("Registration failed:", error);
            toast.error(error.message || "Registration failed. Please try again.");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogle = () => {
        const callbackUrl = window.location.origin;
        // Redirect to backend social login route
        window.location.href = `${API_URL}/auth/login/social/google?callbackURL=${callbackUrl}`;
    };

    const logout = async () => {
        try {
            await api.post("/auth/sign-out");
            setUser(null);
            toast.success("Logged out successfully");
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Failed to logout");
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, signInWithGoogle, logout }}>
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
