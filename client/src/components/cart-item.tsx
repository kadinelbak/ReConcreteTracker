// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import type { CartItem, Product } from "@shared/schema";

interface CartItemProps {
  item: CartItem & { product: Product };
}

export default function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleUpdateQuantity = async (newQuantity: number) => {
    await updateQuantity(item.id, newQuantity);
  };

  const handleRemove = async () => {
    await removeFromCart(item.id);
  };

  const price = item.product.price ? parseFloat(item.product.price) : 0;
  const total = price * item.quantity;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-neutral-dark">{item.product.name}</h4>
        <p className="text-sm text-gray-600 capitalize">{item.product.type}</p>
        <div className="flex items-center mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="mx-3 font-medium">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-neutral-dark">
          {item.product.price ? `$${total.toFixed(2)}` : 'Custom Quote'}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="text-destructive hover:text-destructive/80 mt-1"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  );
}
