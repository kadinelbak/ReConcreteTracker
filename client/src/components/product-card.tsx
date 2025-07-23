// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Recycle, Users, Building } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Recycle className="h-4 w-4 mr-2 text-accent" />;
      case 'service':
        return <Users className="h-4 w-4 mr-2 text-accent" />;
      case 'enterprise':
        return <Building className="h-4 w-4 mr-2 text-accent" />;
      default:
        return <Recycle className="h-4 w-4 mr-2 text-accent" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'product':
        return 'default';
      case 'service':
        return 'secondary';
      case 'enterprise':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getProductImage = (id: number) => {
    const images = [
      "https://images.unsplash.com/photo-1581094271901-8022df4466f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
    ];
    return images[(id - 1) % images.length];
  };

  const handleAddToCart = async () => {
    await addToCart(product.id);
  };

  return (
    <Card className="product-card overflow-hidden hover:shadow-xl transition-all duration-300">
      <img 
        src={getProductImage(product.id)}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      
      <CardContent className="p-6">
        <div className="mb-4">
          <Badge variant={getBadgeVariant(product.type)} className="capitalize">
            {product.type}
          </Badge>
        </div>
        
        <h3 className="text-xl font-bold text-neutral-dark mb-3">
          {product.name}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            {getProductIcon(product.type)}
            <span>
              {product.type === 'product' && 'Contains 15% recycled plastic'}
              {product.type === 'service' && 'Community-scale service'}
              {product.type === 'enterprise' && 'Enterprise-scale solution'}
            </span>
          </div>
          <div className="text-2xl font-bold text-primary">
            {product.price ? `$${product.price}${product.type === 'product' ? '/ct' : '/month'}` : 'Contact Us'}
          </div>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-primary hover:bg-primary/90"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.type === 'enterprise' ? 'Request Quote' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  );
}
