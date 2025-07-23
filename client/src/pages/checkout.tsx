// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Lock } from "lucide-react";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { stripePromise } from "@/lib/stripe";
import CartItemComponent from "@/components/cart-item";

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { clearCart, sessionId } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Payment Error",
        description: "Payment system not ready. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Submit payment element to get validation
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast({
          title: "Payment Error",
          description: submitError.message,
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/checkout',
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error("Payment confirmation error:", error);
        toast({
          title: "Payment Failed",
          description: error.message || "There was an issue processing your payment. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Only create order if payment was successful
      if (paymentIntent && paymentIntent.status === "succeeded") {
        try {
          const orderData = {
            orderNumber: `RC-${Date.now()}`,
            sessionId,
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2),
            paymentMethod: "stripe",
            paymentIntentId: paymentIntent.id,
            status: "completed",
          };

          const response = await apiRequest("POST", "/api/orders", orderData);
          if (!response.ok) {
            throw new Error("Failed to create order");
          }

          await clearCart();
          // Redirect to thank you page with order number
          window.location.href = `/thank-you?order=${orderData.orderNumber}`;
        } catch (err) {
          console.error("Error creating order:", err);
          toast({
            title: "Order Creation Failed",
            description: "Payment was successful but there was an issue creating your order. Please contact support.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Payment Incomplete",
          description: "Payment was not completed successfully. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Payment processing error:", err);
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement />
        <Button 
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          {isProcessing ? (
            <>
              <div className="spinner h-4 w-4 mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Complete Order
            </>
          )}
        </Button>
      </form>

      
    </>
  );
}

export default function Checkout() {
  const { cartItems, cartTotal, cartCount, isLoading } = useCart();
  const [clientSecret, setClientSecret] = useState("");

  const subtotal = cartTotal;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  useEffect(() => {
    if (total > 0) {
      // Create PaymentIntent as soon as we have a total
      apiRequest("POST", "/api/create-payment-intent", { 
        amount: total,
        sessionId: crypto.randomUUID() 
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            throw new Error("No client secret received");
          }
        })
        .catch((error) => {
          console.error("Error creating payment intent:", error);
          toast({
            title: "Payment Setup Error",
            description: "Unable to initialize payment. Please refresh the page and try again.",
            variant: "destructive",
          });
        });
    }
  }, [total]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="spinner h-8 w-8 mx-auto mb-4" />
            <p>Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret && total > 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="spinner h-8 w-8 mx-auto mb-4" />
            <p>Preparing payment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-dark mb-4">Secure Checkout</h1>
          <p className="text-gray-600">Review your order and complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order Summary ({cartCount} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <CartItemComponent key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            {cartItems.length > 0 && total > 0 && clientSecret && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <Label htmlFor="card" className="flex items-center justify-between w-full cursor-pointer">
                      <span>Credit Card</span>
                      <div className="flex space-x-2">
                        <FaCcVisa className="h-6 w-6 text-blue-600" />
                        <FaCcMastercard className="h-6 w-6 text-red-500" />
                        <FaCcAmex className="h-6 w-6 text-blue-500" />
                      </div>
                    </Label>
                  </div>

                  <div className="mt-6">
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm clientSecret={clientSecret} />
                    </Elements>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Total */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {cartItems.length === 0 && (
                  <Button disabled className="w-full" size="lg">
                    <Lock className="h-4 w-4 mr-2" />
                    Cart is Empty
                  </Button>
                )}

                <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center">
                  <Lock className="h-3 w-3 mr-1" />
                  Your payment information is secure and encrypted
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
