import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { API_URL } from "./api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMediaUrl(path?: string | null): string {
  if (!path) return "";

  // Function to strip /api from the end of API_URL
  const getBaseUrl = () => API_URL.replace(/\/api$/, "");

  // Check if it's an uploaded file (contains /uploads/)
  if (path.includes("/uploads/")) {
    const baseUrl = getBaseUrl();
    // Extract the part after /uploads/ (inclusive)
    // We split by /uploads/ and take the last part, then prepend /uploads/
    const parts = path.split("/uploads/");
    const relativePath = parts[parts.length - 1]; // Robust against multiple /uploads/ if that ever happened

    return `${baseUrl}/uploads/${relativePath}`;
  }

  if (path.startsWith("http")) return path;

  // Relative path fallback
  const baseUrl = getBaseUrl();
  if (path.startsWith("/")) {
    return `${baseUrl}${path}`;
  }

  return `${baseUrl}/${path}`;
}
