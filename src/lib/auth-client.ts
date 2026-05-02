import { createAuthClient } from "better-auth/react";

// In production, we must point the auth client to the frontend origin
// so it correctly calls `https://frontend.com/api/auth` which Next.js proxies to the backend.
const AUTH_BASE_URL = process.env.NODE_ENV === "production" 
    ? "https://foodhub-backend-silk.vercel.app" 
    : (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

export const authClient = createAuthClient({
    baseURL: AUTH_BASE_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
