import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Meal, CartItem } from '@/types';
import { toast } from 'sonner';

interface CartState {
    items: CartItem[];
    addItem: (meal: Meal, quantity?: number) => void;
    removeItem: (mealId: string) => void;
    updateQuantity: (mealId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (meal, quantity = 1) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === meal.id);

                // Check for multi-provider conflict
                if (currentItems.length > 0 && !existingItem) {
                    const cartProviderId = currentItems[0].providerProfileId;
                    const newProviderId = meal.providerProfileId;
                    if (cartProviderId && newProviderId && cartProviderId !== newProviderId) {
                        // Clear cart and add new item, warn user
                        toast.warning('Cart cleared — you can only order from one restaurant at a time.', {
                            duration: 4000,
                        });
                        set({ items: [{ ...meal, quantity }] });
                        return;
                    }
                }

                if (existingItem) {
                    set({
                        items: currentItems.map((item) =>
                            item.id === meal.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...currentItems, { ...meal, quantity }] });
                }
            },
            removeItem: (mealId) => {
                set({ items: get().items.filter((item) => item.id !== mealId) });
            },
            updateQuantity: (mealId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(mealId);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.id === mealId ? { ...item, quantity } : item
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
            getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
        }),
        {
            name: 'foodhub-cart',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
