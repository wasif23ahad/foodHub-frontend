"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, LoginCredentials, RegisterData } from "@/types";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
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

            // Assuming the backend returns the user object directly or within a data property
            // Adjust based on actual API response structure if needed
            const user = res.user || res;

            setUser(user as User);
            // Better Auth handles session via cookies usually, but if token is returned, store it if needed
            // localStorage.setItem("foodhub_user", JSON.stringify(user)); 

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
                role: data.role // Ensure backend accepts this field during signup or needs a separate profile update
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

    const logout = async () => {
        try {
            await api.post("/auth/sign-out");
            setUser(null);
            // localStorage.removeItem("foodhub_user"); // If we stop using local storage for auth
            toast.success("Logged out successfully");
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Failed to logout");
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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
