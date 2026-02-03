import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMediaUrl(path?: string | null): string {
  if (!path) return "";

  // If it's already a full URL, return as-is
  if (path.startsWith("http")) return path;

  // Base URL for the backend (remove /api suffix if present)
  // Default to localhost for development if env var is missing
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

  // For /uploads/ paths - these are served from the BACKEND
  if (path.includes("/uploads/") || path.startsWith("/uploads/")) {
    const parts = path.split("/uploads/");
    const relativePath = parts[parts.length - 1];
    return `${apiUrl}/uploads/${relativePath}`;
  }

  // For paths starting with uploads/ without the slash after
  if (path.startsWith("uploads/")) {
    return `${apiUrl}/${path}`;
  }

  // Relative path - assume it's a backend asset if not starting with /
  if (!path.startsWith("/")) {
    return `${apiUrl}/${path}`;
  }

  return path;
}
