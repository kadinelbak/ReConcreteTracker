
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
  ordersToday: number;
  revenueToday: number;
  lowStockItems: number;
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
    queryFn: async () => {
      // Return mock data for now since we don't have the admin API endpoints yet
      return {
        totalProducts: 3,
        ordersToday: 5,
        revenueToday: 1250,
        lowStockItems: 1
      };
    },
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/orders"],
    enabled: isAdmin,
    queryFn: async () => {
      // Return mock data for now
      return [];
    },
  });

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Low Stock Items</p>
                    <p className="text-2xl font-bold text-primary">{stats?.lowStockItems || 0}</p>
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
                            <th className="text-left py-3 px-4 font-semibold text-primary">Order ID</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Customer</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Items</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Total</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Date</th>
                          </tr>
                        </thead>
                        <tbody>
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
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
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
  ArrowLeft,
  Users,
  TrendingUp
} from 'lucide-react';
import type { Order } from '@shared/schema';

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  revenueToday: number;
  activeProducts: number;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // For now, we'll simulate admin access - in a real app, you'd check user authentication
  const isAdmin = true; // This should be replaced with actual admin check

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [isAdmin, toast, setLocation]);

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
    enabled: isAdmin,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
    queryFn: async () => {
      const response = await fetch('/api/admin/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    enabled: isAdmin,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      return await apiRequest("PUT", `/api/admin/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      });
    },
  });

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-primary text-white min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
            <p className="text-primary-foreground/80 text-sm mt-1">ReConcrete</p>
          </div>
          <nav className="mt-8">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="w-full justify-start px-6 py-3 text-white hover:bg-primary/80"
            >
              <ArrowLeft className="w-4 h-4 mr-3" />
              Back to Store
            </Button>
            <div className="px-6 py-3 bg-accent text-accent-foreground">
              <Package className="w-4 h-4 mr-3 inline" />
              Admin Dashboard
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your sustainable concrete products, orders, and analytics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mr-4">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-primary">
                    {statsLoading ? '...' : stats?.totalProducts || 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mr-4">
                  <ShoppingCart className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-accent">
                    {statsLoading ? '...' : stats?.totalOrders || 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue Today</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${statsLoading ? '...' : stats?.revenueToday || 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Products</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {statsLoading ? '...' : stats?.activeProducts || 0}
                  </p>
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
                      <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-semibold text-primary">Order Number</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Total</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Date</th>
                            <th className="text-left py-3 px-4 font-semibold text-primary">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">{order.orderNumber}</td>
                              <td className="py-3 px-4">${order.total}</td>
                              <td className="py-3 px-4">
                                <Badge 
                                  variant={
                                    order.status === 'completed' ? 'default' : 
                                    order.status === 'pending' ? 'secondary' : 'destructive'
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                <select
                                  value={order.status}
                                  onChange={(e) => 
                                    updateOrderStatusMutation.mutate({
                                      orderId: order.id,
                                      status: e.target.value
                                    })
                                  }
                                  className="px-2 py-1 border rounded text-sm"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="completed">Completed</option>
                                  <option value="failed">Failed</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {orders.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No orders found yet.
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
