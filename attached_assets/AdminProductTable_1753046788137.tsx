import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign, 
  Image as ImageIcon 
} from 'lucide-react';
import type { ProductWithCategory, Category, InsertProduct } from '@shared/schema';

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  originalPrice: string;
  categoryId: string;
  imageUrl: string;
  stock: string;
  ingredients: string;
  allergens: string;
  isActive: boolean;
}

const initialFormData: ProductFormData = {
  name: '',
  slug: '',
  description: '',
  price: '',
  originalPrice: '',
  categoryId: '',
  imageUrl: '',
  stock: '',
  ingredients: '',
  allergens: '',
  isActive: true,
};

export default function AdminProductTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products?isActive=all');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: InsertProduct) => {
      return await apiRequest('POST', '/api/products', productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
      setIsDialogOpen(false);
      setFormData(initialFormData);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create product',
        variant: 'destructive',
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertProduct> }) => {
      return await apiRequest('PUT', `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      setIsDialogOpen(false);
      setEditingProduct(null);
      setFormData(initialFormData);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ id, stock }: { id: number; stock: number }) => {
      return await apiRequest('PUT', `/api/products/${id}`, { stock });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Success',
        description: 'Stock updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update stock',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate slug from name if not provided
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');
    
    const productData: InsertProduct = {
      name: formData.name,
      slug,
      description: formData.description,
      price: formData.price,
      originalPrice: formData.originalPrice || undefined,
      categoryId: parseInt(formData.categoryId),
      imageUrl: formData.imageUrl,
      stock: parseInt(formData.stock),
      ingredients: formData.ingredients,
      allergens: formData.allergens,
      isActive: formData.isActive,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleEdit = (product: ProductWithCategory) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price,
      originalPrice: product.originalPrice || '',
      categoryId: product.categoryId?.toString() || '',
      imageUrl: product.imageUrl || '',
      stock: product.stock?.toString() || '0',
      ingredients: product.ingredients || '',
      allergens: product.allergens || '',
      isActive: product.isActive ?? false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleStockChange = (id: number, currentStock: number, change: number) => {
    const newStock = Math.max(0, currentStock + change);
    updateStockMutation.mutate({ id, stock: newStock });
  };

  const handleDirectStockChange = (id: number, newStock: string) => {
    const stock = parseInt(newStock) || 0;
    if (stock >= 0) {
      updateStockMutation.mutate({ id, stock });
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
    } else if (stock < 10) {
      return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-bakery-brown flex items-center gap-2">
            <Package className="w-5 h-5" />
            Products
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-bakery-gold hover:bg-bakery-peru text-white"
                onClick={() => {
                  setEditingProduct(null);
                  setFormData(initialFormData);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-bakery-brown">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="Auto-generated from name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price ($)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoryId">Category</Label>
                    <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ingredients">Ingredients</Label>
                  <Textarea
                    id="ingredients"
                    value={formData.ingredients}
                    onChange={(e) => handleInputChange('ingredients', e.target.value)}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="allergens">Allergens</Label>
                  <Input
                    id="allergens"
                    value={formData.allergens}
                    onChange={(e) => handleInputChange('allergens', e.target.value)}
                    placeholder="e.g., Contains wheat, eggs, milk"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="accent-bakery-gold"
                  />
                  <Label htmlFor="isActive">Active (visible to customers)</Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-bakery-gold hover:bg-bakery-peru text-white"
                    disabled={createProductMutation.isPending || updateProductMutation.isPending}
                  >
                    {createProductMutation.isPending || updateProductMutation.isPending
                      ? 'Saving...'
                      : editingProduct
                      ? 'Update Product'
                      : 'Create Product'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-6 h-6 border-4 border-bakery-gold border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.imageUrl ? (
                            <img 
                              src={product.imageUrl} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-bakery-brown">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.category && (
                        <Badge variant="secondary">{product.category.name}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-bakery-gold" />
                        <span className="font-medium">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStockChange(product.id, product.stock || 0, -1)}
                            className="h-6 w-6 p-0 hover:bg-red-100"
                            disabled={updateStockMutation.isPending}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={product.stock || 0}
                            onChange={(e) => handleDirectStockChange(product.id, e.target.value)}
                            className="w-16 h-8 text-center text-sm"
                            min="0"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStockChange(product.id, product.stock || 0, 1)}
                            className="h-6 w-6 p-0 hover:bg-green-100"
                            disabled={updateStockMutation.isPending}
                          >
                            +
                          </Button>
                        </div>
                        {getStockBadge(product.stock || 0)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={product.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                        }
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="text-bakery-gold hover:text-bakery-peru"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {products.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products found. Create your first product to get started.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
