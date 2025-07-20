// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product, CartItem } from "@shared/schema";

interface CartContextType {
  sessionId: string;
  cartItems: (CartItem & { product: Product })[];
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [sessionId] = useState(() => {
    let id = localStorage.getItem('cart-session-id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('cart-session-id', id);
    }
    return id;
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: cartItems = [], isLoading } = useQuery<(CartItem & { product: Product })[]>({
    queryKey: ['/api/cart', sessionId],
    enabled: !!sessionId,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: number; quantity?: number }) => {
      const response = await apiRequest("POST", "/api/cart", {
        sessionId,
        productId,
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
      toast({
        title: "Added to cart",
        description: "Product successfully added to your cart",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add product to cart",
        variant: "destructive",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) => {
      const response = await apiRequest("PATCH", `/api/cart/${cartItemId}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update cart item",
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (cartItemId: number) => {
      await apiRequest("DELETE", `/api/cart/${cartItemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
      toast({
        title: "Removed from cart",
        description: "Product removed from your cart",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove product from cart",
        variant: "destructive",
      });
    },
  });

  const cartTotal = cartItems.reduce((total: number, item: CartItem & { product: Product }) => {
    if (item.product?.price && item.product.price !== 'custom') {
      return total + (parseFloat(item.product.price) * item.quantity);
    }
    return total;
  }, 0);

  const cartCount = cartItems.reduce((count: number, item: CartItem & { product: Product }) => count + item.quantity, 0);

  const addToCart = async (productId: number, quantity = 1) => {
    await addToCartMutation.mutateAsync({ productId, quantity });
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCartMutation.mutateAsync(cartItemId);
    } else {
      await updateQuantityMutation.mutateAsync({ cartItemId, quantity });
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    await removeFromCartMutation.mutateAsync(cartItemId);
  };

  const clearCart = async () => {
    for (const item of cartItems) {
      await removeFromCartMutation.mutateAsync(item.id);
    }
  };

  return (
    <CartContext.Provider
      value={{
        sessionId,
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
