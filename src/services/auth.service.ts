import { api } from "@/lib/api";
import { LoginCredentials, RegisterData, User, ApiResponse } from "@/types";

export const authService = {
    async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User, token: string }>> {
        return api.post<ApiResponse<{ user: User, token: string }>>("/auth/login", credentials);
    },

    async register(data: RegisterData): Promise<ApiResponse<{ user: User, token: string }>> {
        return api.post<ApiResponse<{ user: User, token: string }>>("/auth/register", data);
    },

    async logout(): Promise<ApiResponse<null>> {
        return api.post<ApiResponse<null>>("/auth/logout");
    },

    async getMe(): Promise<ApiResponse<{ user: User }>> {
        return api.get<ApiResponse<{ user: User }>>("/auth/me", { skipAuthRedirect: true });
    },

    async googleLogin(idToken: string): Promise<ApiResponse<{ user: User, token: string }>> {
        return api.post<ApiResponse<{ user: User, token: string }>>("/auth/google", { idToken });
    }
};
