import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMediaUrl(path?: string | null): string {
  if (!path) return "";

  // If it's already a full URL, return as-is
  if (path.startsWith("http")) return path;

  // For /uploads/ paths - these are served from frontend/public/uploads/
  // Next.js serves files from public/ folder directly
  if (path.includes("/uploads/") || path.startsWith("/uploads/")) {
    // Extract just the /uploads/... part and return it
    // This works because Next.js serves public/uploads/* at /uploads/*
    const parts = path.split("/uploads/");
    const relativePath = parts[parts.length - 1];
    return `/uploads/${relativePath}`;
  }

  // For paths starting with /uploads without the slash after
  if (path.startsWith("uploads/")) {
    return `/${path}`;
  }

  // Relative path - prepend /
  if (!path.startsWith("/")) {
    return `/${path}`;
  }

  return path;
}
