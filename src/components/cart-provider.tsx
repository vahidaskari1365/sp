"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  variantId: number;
  productId: number;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  size: string;
  colorName: string;
  qty: number;
  maxStock: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  hydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: number) => void;
  updateQty: (variantId: number, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const STORAGE_KEY = "termeh_cart_v1";
const CartContext = createContext<CartContextValue | null>(null);

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (item) =>
                typeof item?.variantId === "number" && typeof item?.qty === "number",
            ),
          );
        }
      }
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const addItem = useCallback((item: CartItem) => {
    setItems((previous) => {
      const existing = previous.find((entry) => entry.variantId === item.variantId);
      if (existing) {
        return previous.map((entry) =>
          entry.variantId === item.variantId
            ? {
                ...entry,
                qty: Math.min(entry.maxStock || 10, entry.qty + item.qty),
              }
            : entry,
        );
      }
      return [...previous, item];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((variantId: number) => {
    setItems((previous) => previous.filter((item) => item.variantId !== variantId));
  }, []);

  const updateQty = useCallback((variantId: number, qty: number) => {
    setItems((previous) =>
      previous
        .map((item) =>
          item.variantId === variantId
            ? { ...item, qty: Math.max(0, Math.min(item.maxStock || 10, qty)) }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    return {
      items,
      count,
      subtotal,
      isOpen,
      hydrated,
      addItem,
      removeItem,
      updateQty,
      clear,
      openCart,
      closeCart,
    };
  }, [items, isOpen, hydrated, addItem, removeItem, updateQty, clear, openCart, closeCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
