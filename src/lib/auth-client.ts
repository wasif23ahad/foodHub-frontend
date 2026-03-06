import { createAuthClient } from "better-auth/react";

// Always use the relative /api path in production so requests go through the Next.js proxy 
// (which solves cross-domain cookie issues). In local dev, fallback to localhost.
const API_URL = process.env.NODE_ENV === "production" ? "/api" : (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api");

export const authClient = createAuthClient({
    // We strictly proxy the auth requests to avoid state_mismatch cross-domain cookie destruction 
    baseURL: API_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
