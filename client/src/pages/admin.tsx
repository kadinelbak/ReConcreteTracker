
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
  ordersToday: number;
  revenueToday: number;
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-primary">{stats?.totalProducts || 0}</p>
                  </div>
                  <Package className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Orders Today</p>
                    <p className="text-2xl font-bold text-primary">{stats?.ordersToday || 0}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenue Today</p>
                    <p className="text-2xl font-bold text-primary">${stats?.revenueToday || 0}</p>
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
                            <th className="text-left py-3 px-4 font-semibold text-primary">Order Details</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Customer & Payment</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Items Ordered</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Financial Summary</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Status & Actions</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Order Timeline</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order: any) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                              {/* Order Details */}
                              <td className="py-4 px-4">
                                <div className="space-y-1">
                                  <div className="font-semibold text-primary">#{order.orderNumber || order.id}</div>
                                  <div className="text-xs text-gray-500">
                                    Payment Intent: {order.paymentIntentId ? order.paymentIntentId.substring(0, 12) + '...' : 'N/A'}
                                  </div>
                                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block">
                                    {order.userId ? 'Registered User' : 'Guest Customer'}
                                  </div>
                                </div>
                              </td>

                              {/* Customer & Payment Info */}
                              <td className="py-4 px-4">
                                <div className="text-sm space-y-2">
                                  <div>
                                    <div className="font-medium text-gray-900">Customer ID:</div>
                                    <div className="text-gray-600">
                                      {order.userId || 'Guest'}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">Session:</div>
                                    <div className="text-gray-600 font-mono text-xs">
                                      {order.sessionId ? order.sessionId.substring(0, 16) + '...' : 'N/A'}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">Payment Method:</div>
                                    <div className="text-gray-600 capitalize">
                                      {order.paymentMethod || 'Not specified'}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Items Ordered */}
                              <td className="py-4 px-4">
                                <div className="text-sm space-y-2 max-w-xs">
                                  {order.items && order.items.length > 0 ? (
                                    <>
                                      <div className="font-medium text-gray-900">
                                        {order.items.length} item{order.items.length > 1 ? 's' : ''}:
                                      </div>
                                      {order.items.map((item: any, index: number) => (
                                        <div key={index} className="bg-gray-50 p-2 rounded border-l-3 border-accent">
                                          <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                              <div className="font-medium text-primary">
                                                {item.productName || item.product?.name || 'Unknown Product'}
                                              </div>
                                              <div className="text-xs text-gray-500 mt-1">
                                                {item.product?.description && item.product.description.substring(0, 50) + '...'}
                                              </div>
                                              <div className="text-xs text-gray-600 mt-1">
                                                Category: {item.product?.category || 'N/A'}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex justify-between items-center mt-2">
                                            <span className="text-sm font-medium">Qty: {item.quantity}</span>
                                            <span className="text-sm font-semibold text-accent">
                                              ${parseFloat(item.price || 0).toFixed(2)} each
                                            </span>
                                          </div>
                                          <div className="text-right text-sm font-bold text-primary mt-1">
                                            Total: ${(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                                          </div>
                                        </div>
                                      ))}
                                    </>
                                  ) : (
                                    <div className="text-gray-500 italic">No items found</div>
                                  )}
                                </div>
                              </td>

                              {/* Financial Summary */}
                              <td className="py-4 px-4">
                                <div className="text-sm space-y-2 bg-gray-50 p-3 rounded">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium">${parseFloat(order.subtotal || 0).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Tax:</span>
                                    <span className="font-medium">${parseFloat(order.tax || 0).toFixed(2)}</span>
                                  </div>
                                  <div className="border-t pt-2 flex justify-between">
                                    <span className="font-semibold text-primary">Total:</span>
                                    <span className="font-bold text-lg text-primary">${parseFloat(order.total).toFixed(2)}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 text-center mt-2">
                                    Items: {order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0}
                                  </div>
                                </div>
                              </td>

                              {/* Status & Actions */}
                              <td className="py-4 px-4">
                                <div className="space-y-3">
                                  <Badge className={getStatusColor(order.status)}>
                                    {order.status}
                                  </Badge>
                                  <select
                                    value={order.status}
                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                    className="w-full border rounded px-2 py-1 text-xs bg-white"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                  <div className="text-xs text-gray-500">
                                    {updateOrderStatusMutation.isPending && order.id ? (
                                      <span className="text-blue-600">Updating...</span>
                                    ) : (
                                      'Click to update status'
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Order Timeline */}
                              <td className="py-4 px-4">
                                <div className="text-sm space-y-2">
                                  <div>
                                    <div className="font-medium text-gray-900">Created:</div>
                                    <div className="text-gray-600">
                                      {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(order.createdAt).toLocaleTimeString()}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Order Age: {Math.floor((Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                                  </div>
                                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    Payment Completed
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {orders.length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center py-8 text-gray-500">
                                No orders found.
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
