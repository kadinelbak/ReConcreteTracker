
// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Heart, ShoppingCart, ArrowRight, Recycle } from "lucide-react";

export default function ThankYou() {
  const [location] = useLocation();
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    // Extract order number from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderParam = urlParams.get('order');
    if (orderParam) {
      setOrderNumber(orderParam);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-dark mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for choosing ReConcrete for your sustainable building needs.
          </p>

          {/* Order Details Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderNumber && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-neutral-dark mb-2">
                    Order #{orderNumber}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Confirmation email will be sent shortly
                  </p>
                </div>
              )}
              
              <div className="space-y-2 text-left">
                <p className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="font-medium text-green-600">Completed</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Processing Time:</span>
                  <span className="font-medium">1-2 business days</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">Free</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/products">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                <ArrowRight className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full">
                <Recycle className="h-4 w-4 mr-2" />
                Return to Home
              </Button>
            </Link>
          </div>

          {/* Referral Message */}
          <div className="mt-8 p-6 bg-accent/10 rounded-xl">
            <p className="text-accent font-medium flex items-center justify-center">
              <Heart className="h-4 w-4 mr-2" />
              Help us grow! Please refer ReConcrete to your network.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Together, we're building a more sustainable future through innovative recycled concrete solutions.
            </p>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Stay connected with ReConcrete:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="https://www.youtube.com/channel/UC4zdc1nB53ekKx4tj17EabA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-accent hover:text-accent/80 transition-colors duration-200"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png" 
                    alt="YouTube" 
                    className="h-4 w-4 mr-2"
                  />
                  Visit our YouTube Channel
                </a>
                <a 
                  href="https://v.douyin.com/Imkal4NiVNQ/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-accent hover:text-accent/80 transition-colors duration-200"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a9/TikTok_logo.svg" 
                    alt="TikTok" 
                    className="h-4 w-4 mr-2"
                  />
                  Follow us on TikTok
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
