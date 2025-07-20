import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AdminProductTable from '@/components/AdminProductTable';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import type { User } from '@shared/schema';

interface AdminStats {
  totalProducts: number;
  ordersToday: number;
  revenueToday: number;
  lowStockItems: number;
}

export default function Admin() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [user, isLoading, toast, setLocation]);

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: !!user?.isAdmin,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/orders"],
    enabled: !!user?.isAdmin,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      return await apiRequest("PUT", `/api/admin/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Order Updated",
        description: "Order status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateOrderStatus = (orderId: number, status: string) => {
    updateOrderStatusMutation.mutate({ orderId, status });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading || statsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin w-8 h-8 border-4 border-bakery-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-bakery-brown text-white min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
            <p className="text-bakery-cream text-sm mt-1">Golden Crust Bakery</p>
          </div>
          <nav className="mt-8">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="w-full justify-start px-6 py-3 text-white hover:bg-bakery-gold"
            >
              <ArrowLeft className="w-4 h-4 mr-3" />
              Back to Store
            </Button>
            <div className="px-6 py-3 bg-bakery-gold">
              <Package className="w-4 h-4 mr-3 inline" />
              Admin Dashboard
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-bakery-brown">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your bakery products, orders, and analytics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-bakery-brown">{stats?.totalProducts || 0}</p>
                  </div>
                  <Package className="w-8 h-8 text-bakery-gold" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Orders Today</p>
                    <p className="text-2xl font-bold text-bakery-brown">{stats?.ordersToday || 0}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-bakery-gold" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenue Today</p>
                    <p className="text-2xl font-bold text-bakery-brown">${stats?.revenueToday || 0}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-bakery-gold" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Low Stock Items</p>
                    <p className="text-2xl font-bold text-bakery-brown">{stats?.lowStockItems || 0}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="mt-6">
              <AdminProductTable />
            </TabsContent>
            
            <TabsContent value="orders" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-bakery-brown">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin w-6 h-6 border-4 border-bakery-gold border-t-transparent rounded-full" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-semibold text-bakery-brown">Order ID</th>
                            <th className="text-left py-3 px-4 font-semibold text-bakery-brown">Customer</th>
                            <th className="text-left py-3 px-4 font-semibold text-bakery-brown">Shipping Address</th>
                            <th className="text-left py-3 px-4 font-semibold text-bakery-brown">Items</th>
                            <th className="text-left py-3 px-4 font-semibold text-bakery-brown">Total</th>
                            <th className="text-left py-3 px-4 font-semibold text-bakery-brown">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-bakery-brown">Date</th>
                            <th className="text-left py-3 px-4 font-semibold text-bakery-brown">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order: any) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <span className="font-medium">#{order.id}</span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-sm">
                                  <div className="font-medium">{order.user?.firstName} {order.user?.lastName}</div>
                                  <div className="text-gray-500">{order.user?.email}</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-sm">
                                  {order.shippingAddress && (
                                    <>
                                      <div className="font-medium">{order.shippingAddress.name}</div>
                                      <div className="text-gray-500">{order.shippingAddress.email}</div>
                                      {order.shippingAddress.phone && <div className="text-gray-500">{order.shippingAddress.phone}</div>}
                                      <div className="text-gray-500 mt-1">
                                        {order.shippingAddress.address}<br/>
                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                                      </div>
                                      {order.shippingAddress.deliveryInstructions && (
                                        <div className="text-xs text-blue-600 mt-1">
                                          📝 {order.shippingAddress.deliveryInstructions}
                                        </div>
                                      )}
                                    </>
                                  )}
                                  {!order.shippingAddress && (
                                    <span className="text-gray-400 italic">No shipping info</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-sm">
                                  {order.items?.map((item: any, index: number) => (
                                    <div key={index} className="mb-1">
                                      <span className="font-medium">{item.product?.name}</span>
                                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                    </div>
                                  ))}
                                  <div className="text-xs text-gray-400 mt-1">
                                    {order.items?.length || 0} item(s)
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-medium">${order.total}</div>
                                <div className="text-xs text-gray-500">
                                  Subtotal: ${order.subtotal}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-sm">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(order.createdAt).toLocaleTimeString()}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                  className="border rounded px-2 py-1 text-sm"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {orders.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No orders found.
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            
          </Tabs>
        </div>
      </div>
    </div>
  );
}
