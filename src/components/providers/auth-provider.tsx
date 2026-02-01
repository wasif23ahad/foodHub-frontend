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
                // In a real app, we would verify the token or fetch the user profile here
                // For now, we'll check local storage for a mock user
                const storedUser = localStorage.getItem("foodhub_user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Auth check failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            // MOCK LOGIN implementation for demo
            // TODO: Replace with actual API call: const res = await api.post("/auth/login", credentials);

            console.log("Logging in with:", credentials);

            // Simulating API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockUser: User = {
                id: "1",
                name: "Demo User",
                email: credentials.email,
                role: "customer",
                emailVerified: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            setUser(mockUser);
            localStorage.setItem("foodhub_user", JSON.stringify(mockUser));
            toast.success("Logged in successfully");
            router.push("/");

        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Invalid credentials");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        setIsLoading(true);
        try {
            // MOCK REGISTER implementation for demo
            // TODO: Replace with actual API call: const res = await api.post("/auth/register", data);

            console.log("Registering with:", data);

            // Simulating API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockUser: User = {
                id: "1",
                name: data.name,
                email: data.email,
                role: data.role === "customer" ? "customer" : "provider", // Mapping simple string to UserRole
                emailVerified: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            setUser(mockUser);
            localStorage.setItem("foodhub_user", JSON.stringify(mockUser));
            toast.success("Account created successfully");
            router.push("/");

        } catch (error) {
            console.error("Registration failed:", error);
            toast.error("Registration failed. Please try again.");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            // TODO: Call API logout endpoint if needed
            setUser(null);
            localStorage.removeItem("foodhub_user");
            toast.success("Logged out successfully");
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
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
