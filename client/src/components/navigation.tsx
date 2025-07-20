// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Recycle, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Recycle className="text-accent mr-2 h-8 w-8" />
              <h1 className="text-2xl font-bold text-primary">ReConcrete</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#about" 
              className="text-gray-600 hover:text-accent px-3 py-2 text-sm font-medium transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                if (location === '/') {
                  document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = '/#about';
                }
              }}
            >
              About Us
            </a>
            <Link 
              href="/products" 
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                location === '/products' 
                  ? 'text-primary font-semibold' 
                  : 'text-gray-600 hover:text-accent'
              }`}
            >
              Products
            </Link>
            <Link 
              href="/contact" 
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                location === '/contact' 
                  ? 'text-primary font-semibold' 
                  : 'text-gray-600 hover:text-accent'
              }`}
            >
              Contact
            </Link>
          </div>
          
          {/* Right side - Cart and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
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
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              <a
                href="#about"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-accent hover:bg-gray-50 transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  if (location === '/') {
                    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = '/#about';
                  }
                }}
              >
                About Us
              </a>
              <Link
                href="/products"
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  location === '/products'
                    ? 'text-primary bg-gray-50'
                    : 'text-gray-600 hover:text-accent hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/contact"
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  location === '/contact'
                    ? 'text-primary bg-gray-50'
                    : 'text-gray-600 hover:text-accent hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
