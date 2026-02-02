// User types
export type UserRole = "customer" | "provider" | "admin";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

// Provider types
export interface Provider {
    id: string;
    userId: string;
    businessName: string;
    description?: string;
    logo?: string;
    address?: string;
    phone?: string;
    cuisineType?: string;
    contactEmail?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    user?: User;
    avgRating?: number;
    rating?: number; // Added static rating from backend
    totalReviews?: number;
    meals?: Meal[];
}

// Category types
export interface Category {
    id: string;
    name: string;
    description?: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        meals: number;
    };
}

// Meal types
export type MealSortingOption =
    | "newest"
    | "oldest"
    | "price_asc"
    | "price_desc"
    | "rating"
    | "popular";

export interface Meal {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    categoryId: string;
    providerProfileId: string;
    isAvailable: boolean;
    avgRating?: number;
    reviewCount?: number;
    createdAt: string;
    updatedAt: string;
    category?: Category;
    providerProfile?: Provider;
}

// Cart types
export interface CartItem {
    meal: Meal;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
    total: number;
}

// Order types
export type OrderStatus =
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";

export interface OrderItem {
    id: string;
    orderId: string;
    mealId: string;
    quantity: number;
    price: number;
    meal?: Meal;
}

export interface Order {
    id: string;
    userId: string;
    providerId: string;
    status: OrderStatus;
    totalAmount: number;
    deliveryAddress: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    user?: User;
    provider?: Provider;
    items?: OrderItem[];
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Auth types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role: "customer" | "provider";
}

export interface AuthSession {
    user: User;
    token: string;
}
