// User types
export type UserRole = "customer" | "provider" | "admin";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string;
    emailVerified: boolean;
    address?: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
    banned?: boolean;
    banReason?: string;
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
    contactPhone?: string;
    coverImage?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    user?: User;
    avgRating?: number;
    rating?: number; // Added static rating from backend
    totalReviews?: number;
    meals?: Meal[];
}

export type ProviderProfile = Provider;

// Category types
export interface Category {
    id: string;
    name: string;
    description?: string;
    image?: string;
    isFeatured?: boolean;
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

export type DietaryPreference =
    | "REGULAR"
    | "VEGETARIAN"
    | "VEGAN"
    | "GLUTEN_FREE"
    | "KETO"
    | "HALAL";

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
    dietaryPreference?: DietaryPreference;
}

// Cart types
export interface CartItem extends Meal {
    quantity: number;
}

export interface Cart {
    items: CartItem[];
    total: number;
}

// Order types
export type OrderStatus =
    | "PLACED"
    | "PREPARING"
    | "READY"
    | "DELIVERED"
    | "CANCELLED";

export interface OrderItem {
    id: string;
    orderId: string;
    mealId: string;
    quantity: number;
    price: number;
    unitPrice?: number;
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
    customer?: User;
    providerProfile?: Provider;
    items?: OrderItem[];
    orderItems?: OrderItem[];
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
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
