import { useAuthStore } from "@/stores/auth-store";

const API_URL = process.env.NODE_ENV === "production" ? "/api" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api");

type RequestOptions = {
    headers?: Record<string, string>;
    cache?: RequestCache;
    next?: { revalidate?: number; tags?: string[] };
    skipAuthRedirect?: boolean;
};

async function handleResponse<T>(res: Response, options?: RequestOptions): Promise<T> {
    const contentType = res.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");

    if (!res.ok) {
        if (res.status === 401 && !options?.skipAuthRedirect) {
            // Clear local auth state on unauthorized
            if (typeof window !== "undefined") {
                useAuthStore.getState().logout();
                // Avoid infinite redirect loop if already on login or register page
                const isAuthPage = ["/login", "/register"].includes(window.location.pathname);
                if (!isAuthPage) {
                    window.location.href = "/login";
                }
            }
        }

        let errorMsg = `API Error: ${res.status} ${res.statusText}`;
        if (isJson) {
            try {
                const errorData = await res.json();
                errorMsg = errorData.message || errorMsg;
            } catch {
                // ignore
            }
        } else {
            const text = await res.text().catch(() => "");
            if (text?.startsWith("<")) errorMsg = "Server returned an HTML page instead of JSON. Check backend deployment.";
            else if (text) errorMsg = text.slice(0, 200);
        }
        
        // Wrap in a custom error object to allow checking status
        const error = new Error(errorMsg) as any;
        error.status = res.status;
        throw error;
    }

    if (!isJson) {
        const text = await res.text().catch(() => "");
        if (text?.startsWith("<")) {
            throw new Error("Server returned an HTML page instead of JSON.");
        }
        if (res.status === 204) return {} as T;
        return {} as T;
    }

    return await res.json();
}

export const api = {
    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        const headers: Record<string, string> = { ...options?.headers };
        if (typeof document !== "undefined") {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            if (token) headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "GET",
            headers,
            credentials: "include",
            cache: options?.cache,
            next: options?.next,
        });
        return handleResponse<T>(res, options);
    },

    async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
        const isFormData = data instanceof FormData;
        const headers: Record<string, string> = { ...options?.headers };
        if (!isFormData) headers["Content-Type"] = "application/json";
        if (typeof document !== "undefined") {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            if (token) headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers,
            credentials: "include",
            body: isFormData ? (data as FormData) : (data ? JSON.stringify(data) : undefined),
        });
        return handleResponse<T>(res, options);
    },

    async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
        const headers: Record<string, string> = { "Content-Type": "application/json", ...options?.headers };
        if (typeof document !== "undefined") {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            if (token) headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "PUT",
            headers,
            credentials: "include",
            body: data ? JSON.stringify(data) : undefined,
        });
        return handleResponse<T>(res, options);
    },

    async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
        const headers: Record<string, string> = { "Content-Type": "application/json", ...options?.headers };
        if (typeof document !== "undefined") {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            if (token) headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "PATCH",
            headers,
            credentials: "include",
            body: data ? JSON.stringify(data) : undefined,
        });
        return handleResponse<T>(res, options);
    },

    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        const headers: Record<string, string> = { "Content-Type": "application/json", ...options?.headers };
        if (typeof document !== "undefined") {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            if (token) headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "DELETE",
            headers,
            credentials: "include",
        });
        return handleResponse<T>(res, options);
    },
};

export { API_URL };
