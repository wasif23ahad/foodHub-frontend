const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type RequestOptions = {
    headers?: Record<string, string>;
    cache?: RequestCache;
    next?: { revalidate?: number; tags?: string[] };
};

/**
 * API client for making requests to the backend
 */
export const api = {
    /**
     * GET request
     */
    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        const url = `${API_URL}${endpoint}`;
        console.log(`[API GET] ${url} (Base: ${API_URL})`);

        const res = await fetch(url, {
            method: "GET",
            headers: {
                ...options?.headers,
            },
            credentials: "include",
            cache: options?.cache,
            next: options?.next,
        });

        if (!res.ok) {
            let errorMsg = `API Error: ${res.status} ${res.statusText}`;
            try {
                const errorData = await res.json();
                errorMsg = errorData.message || errorMsg;
            } catch (e) {
                const text = await res.text().catch(() => "");
                if (text) errorMsg = text;
            }
            throw new Error(errorMsg);
        }

        try {
            return await res.json();
        } catch (e) {
            console.error("Failed to parse JSON response:", e);
            throw new Error("Invalid response from server");
        }
    },

    /**
     * POST request
     */
    async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            credentials: "include",
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || `API Error: ${res.status}`);
        }

        return res.json();
    },

    /**
     * PUT request
     */
    async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            credentials: "include",
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || `API Error: ${res.status}`);
        }

        return res.json();
    },

    /**
     * PATCH request
     */
    async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            credentials: "include",
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || `API Error: ${res.status}`);
        }

        return res.json();
    },

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
            credentials: "include",
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || `API Error: ${res.status}`);
        }

        return res.json();
    },
};

export { API_URL };
