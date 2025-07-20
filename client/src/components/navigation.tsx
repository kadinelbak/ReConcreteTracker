// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Recycle } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export default function Navigation() {
  const [location] = useLocation();
  const { cartCount } = useCart();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Recycle className="text-accent mr-2 h-8 w-8" />
              <h1 className="text-2xl font-bold text-primary">ReConcrete</h1>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a 
                href="#about" 
                className="text-gray-600 hover:text-accent px-3 py-2 text-sm font-medium transition-colors duration-200"
                onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                About Us
              </a>
              <Link 
                href="/products" 
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  location === '/products' 
                    ? 'text-primary' 
                    : 'text-gray-600 hover:text-accent'
                }`}
              >
                Products
              </Link>
              <Link 
                href="/contact" 
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  location === '/contact' 
                    ? 'text-primary' 
                    : 'text-gray-600 hover:text-accent'
                }`}
              >
                Contact
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <Link href="/checkout">
              <Button variant="ghost" size="sm" className="relative p-2">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
