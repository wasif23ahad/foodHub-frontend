"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, LoginCredentials, RegisterData } from "@/types";
import { api, API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: LoginCredentials, requireRole?: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    signInWithGoogle: () => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Helper to fetch fresh user data
    const fetchFreshUser = async (userFromSession: User) => {
        try {
            // Fetch fresh data from DB to bypass BetterAuth session cache
            const freshProfile = await api.get<{ data: User }>("/user/profile");
            return freshProfile.data || freshProfile;
        } catch (error) {
            console.error("Failed to fetch fresh profile, using session data:", error);
            return userFromSession;
        }
    };

    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const session = await api.get<{ user: User } | null>("/auth/get-session");
                if (session?.user) {
                    const freshUser = await fetchFreshUser(session.user);
                    setUser(freshUser as User);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const refreshUser = async () => {
        try {
            const session = await api.get<{ user: User } | null>("/auth/get-session");
            if (session?.user) {
                const freshUser = await fetchFreshUser(session.user);
                setUser(freshUser as User);
            }
        } catch (error) {
            console.error("Refresh user failed:", error);
        }
    };

    const login = async (credentials: LoginCredentials, requireRole?: string) => {
        setIsLoading(true);
        try {
            const res = await api.post<any>("/auth/sign-in/email", credentials);

            // BetterAuth returns { user: {...}, session: {...} }
            const user = res?.user || res;
            const userRole = (user?.role || "").toUpperCase();

            // Strict role checking if requested
            if (requireRole && userRole !== requireRole.toUpperCase()) {
                await api.post("/auth/sign-out");
                toast.error(`Authorized access only. This is an ${requireRole} portal.`);
                throw new Error("Access denied: Insufficient permissions.");
            }

            setUser(user as User);
            toast.success("Logged in successfully");

            // Role-based redirection
            const redirectUrl = userRole === "ADMIN" ? "/admin" : "/";
            router.push(redirectUrl);
        } catch (error: any) {
            console.error("Login failed:", error);
            if (!error.message?.includes("Access denied")) {
                toast.error(error.message || "Invalid credentials");
            }
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
        window.location.href = `${API_URL}/auth/sign-in/social/google?callbackURL=${callbackUrl}`;
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
        <AuthContext.Provider value={{ user, isLoading, login, register, signInWithGoogle, logout, refreshUser }}>
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
