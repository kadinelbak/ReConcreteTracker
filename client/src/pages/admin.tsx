
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
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
  ArrowLeft,
  Recycle
} from 'lucide-react';

interface AdminStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  ordersToday: number;
  revenueToday: number;
  totalRevenue: number;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // For now, we'll assume anyone can access admin - you can add authentication later
  const [isAdmin] = useState(true);

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: isAdmin,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/orders"],
    enabled: isAdmin,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update order status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status",
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

  if (statsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-primary text-white min-h-screen">
          <div className="p-6">
            <div className="flex items-center mb-2">
              <Recycle className="text-accent mr-2 h-6 w-6" />
              <h2 className="text-xl font-bold">ReConcrete</h2>
            </div>
            <p className="text-gray-200 text-sm">Admin Dashboard</p>
          </div>
          <nav className="mt-8">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="w-full justify-start px-6 py-3 text-white hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4 mr-3" />
              Back to Website
            </Button>
            <div className="px-6 py-3 bg-accent">
              <Package className="w-4 h-4 mr-3 inline" />
              Admin Dashboard
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your ReConcrete products, orders, and analytics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-primary">{stats?.totalProducts || 0}</p>
                    <p className="text-xs text-gray-500">{stats?.activeProducts || 0} active</p>
                  </div>
                  <Package className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-primary">{stats?.totalOrders || 0}</p>
                    <p className="text-xs text-gray-500">{stats?.ordersToday || 0} today</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-primary">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                    <p className="text-xs text-gray-500">
                      {stats?.totalRevenue > 0 ? 'From completed purchases' : 'No completed purchases yet'}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today's Revenue</p>
                    <p className="text-2xl font-bold text-primary">${stats?.revenueToday?.toFixed(2) || '0.00'}</p>
                    <p className="text-xs text-gray-500">
                      {stats?.revenueToday > 0 ? 'From completed orders today' : 'No completed orders today'}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-accent" />
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
                  <CardTitle className="text-primary">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin w-6 h-6 border-4 border-accent border-t-transparent rounded-full" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-semibold text-primary">Order #</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Items</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Total</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Date</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order: any) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div className="font-semibold">#{order.orderNumber || order.id}</div>
                                <div className="text-xs text-gray-500">
                                  {order.paymentMethod}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="space-y-1">
                                  {order.items && order.items.length > 0 ? (
                                    order.items.map((item: any, index: number) => (
                                      <div key={index} className="text-sm">
                                        <span className="font-medium">{item.quantity}x</span> {item.productName || item.product?.name}
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-gray-500 text-sm">No items</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-semibold text-primary">${parseFloat(order.total || 0).toFixed(2)}</div>
                                {order.subtotal && (
                                  <div className="text-xs text-gray-500">
                                    Subtotal: ${parseFloat(order.subtotal).toFixed(2)}
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <Badge 
                                  className={getStatusColor(order.status)}
                                >
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
                                  className="px-2 py-1 border rounded text-sm"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="completed">Completed</option>
                                  <option value="failed">Failed</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                          {orders.length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center py-8 text-gray-500">
                                <div className="flex flex-col items-center">
                                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                  <p className="text-lg font-medium">No orders found</p>
                                  <p className="text-sm text-gray-400">Completed orders with sustainable concrete products will appear here</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
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
