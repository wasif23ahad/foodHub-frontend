import { useAuthStore } from "@/stores/auth-store";

const API_URL = process.env.NODE_ENV === "production" ? "/api" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api");

type RequestOptions = {
    headers?: Record<string, string>;
    cache?: RequestCache;
    next?: { revalidate?: number; tags?: string[] };
};

async function handleResponse<T>(res: Response): Promise<T> {
    const contentType = res.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");

    if (!res.ok) {
        if (res.status === 401) {
            // Clear local auth state on unauthorized
            if (typeof window !== "undefined") {
                useAuthStore.getState().logout();
                // Avoid infinite redirect loop if already on login page
                if (window.location.pathname !== "/login") {
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
        throw new Error(errorMsg);
    }

    if (!isJson) {
        const text = await res.text().catch(() => "");
        if (text?.startsWith("<")) {
            throw new Error("Server returned an HTML page instead of JSON.");
        }
        // Handle 204 No Content
        if (res.status === 204) return {} as T;
        return {} as T;
    }

    return await res.json();
}

export const api = {
    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "GET",
            headers: options?.headers,
            credentials: "include",
            cache: options?.cache,
            next: options?.next,
        });
        return handleResponse<T>(res);
    },

    async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
        const isFormData = data instanceof FormData;
        const headers = { ...options?.headers };
        if (!isFormData) headers["Content-Type"] = "application/json";

        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers,
            credentials: "include",
            body: isFormData ? (data as FormData) : (data ? JSON.stringify(data) : undefined),
        });
        return handleResponse<T>(res);
    },

    async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...options?.headers },
            credentials: "include",
            body: data ? JSON.stringify(data) : undefined,
        });
        return handleResponse<T>(res);
    },

    async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", ...options?.headers },
            credentials: "include",
            body: data ? JSON.stringify(data) : undefined,
        });
        return handleResponse<T>(res);
    },

    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", ...options?.headers },
            credentials: "include",
        });
        return handleResponse<T>(res);
    },
};

export { API_URL };
