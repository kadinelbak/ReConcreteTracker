import { 
  users, products, videos, cartItems, orders, orderItems,
  type User, type InsertUser, type Product, type InsertProduct,
  type Video, type InsertVideo, type CartItem, type InsertCartItem,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, inArray, gte, lt, sql } from "drizzle-orm";

// Storage interface definition
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;

  // Product methods
  getProducts(): Promise<Product[]>;

  // Cart methods
  addToCart(insertCartItem: InsertCartItem): Promise<CartItem>;
  getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]>;
  updateCartItemQuantity(cartItemId: number, quantity: number): Promise<CartItem>;
  removeFromCart(cartItemId: number): Promise<void>;
  clearCart(sessionId: string): Promise<void>;

  // Video methods
  createVideo(insertVideo: InsertVideo): Promise<Video>;
  getVideos(): Promise<Video[]>;

  // Order methods
  createOrder(insertOrder: InsertOrder): Promise<Order>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  createOrderItems(orderItems: InsertOrderItem[]): Promise<OrderItem[]>;

  // Admin methods
  getAdminStats(): Promise<any>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(orderId: number, status: string): Promise<Order>;
  createProduct(productData: InsertProduct): Promise<Product>;
  updateProduct(productId: number, productData: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(productId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true)).orderBy(products.id);
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    const [cartItem] = await db
      .insert(cartItems)
      .values(insertCartItem)
      .returning();
    return cartItem;
  }

  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const result = await db
      .select()
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.sessionId, sessionId))
      .orderBy(cartItems.createdAt);

    return result.map(row => ({
      ...row.cart_items,
      product: row.products
    }));
  }

  async updateCartItemQuantity(cartItemId: number, quantity: number): Promise<CartItem> {
    const [cartItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, cartItemId))
      .returning();
    return cartItem;
  }

  async removeFromCart(cartItemId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
  }

  async clearCart(sessionId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const [video] = await db
      .insert(videos)
      .values(insertVideo)
      .returning();
    return video;
  }

  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos).orderBy(desc(videos.createdAt));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    // If sessionId is provided, calculate totals from cart and create order items
    if (insertOrder.sessionId) {
      // Get cart items with product details
      const cartItemsWithProducts = await this.getCartItems(insertOrder.sessionId);
      
      if (cartItemsWithProducts.length === 0) {
        throw new Error('Cannot create order: cart is empty');
      }
      
      // Calculate totals from cart items
      let subtotal = 0;
      cartItemsWithProducts.forEach(item => {
        const price = parseFloat(item.product.price?.toString() || '0');
        subtotal += price * item.quantity;
      });
      
      const taxRate = 0.08; // 8% tax rate
      const tax = subtotal * taxRate;
      const total = subtotal + tax;
      
      // Update order data with calculated values
      const orderData = {
        ...insertOrder,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
      };
      
      // Create the order
      const [order] = await db
        .insert(orders)
        .values(orderData)
        .returning();
      
      // Create order items from cart items
      const orderItemsData = cartItemsWithProducts.map(cartItem => ({
        orderId: order.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: cartItem.product.price?.toString() || '0'
      }));
      
      await db.insert(orderItems).values(orderItemsData);
      
      return order;
    } else {
      // For orders without sessionId (legacy or direct creation)
      const [order] = await db
        .insert(orders)
        .values(insertOrder)
        .returning();
      return order;
    }
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    return order || undefined;
  }

  async createOrderItems(orderItemsData: InsertOrderItem[]): Promise<OrderItem[]> {
    return await db.insert(orderItems).values(orderItemsData).returning();
  }

  // Admin methods

  async getAdminStats(): Promise<any> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get total products count
      const [totalProducts] = await db.select({ count: sql<number>`count(*)` }).from(products);

      // Get active products count
      const [activeProducts] = await db.select({ count: sql<number>`count(*)` })
        .from(products)
        .where(eq(products.isActive, true));

      // Get orders today count
      const [ordersToday] = await db.select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(and(
          gte(orders.createdAt, today),
          lt(orders.createdAt, tomorrow)
        ));

      // Get revenue today
      const [revenueTodayResult] = await db.select({ 
        total: sql<string>`COALESCE(sum(${orders.total}), 0)` 
      })
      .from(orders)
      .where(and(
        gte(orders.createdAt, today),
        lt(orders.createdAt, tomorrow),
        eq(orders.status, 'completed')
      ));

      // Get total revenue (all time)
      const [totalRevenueResult] = await db.select({ 
        total: sql<string>`COALESCE(sum(${orders.total}), 0)` 
      })
      .from(orders)
      .where(eq(orders.status, 'completed'));

      // Get total orders count
      const [totalOrders] = await db.select({ count: sql<number>`count(*)` }).from(orders);

      return {
        totalProducts: totalProducts.count,
        activeProducts: activeProducts.count,
        totalOrders: totalOrders.count,
        ordersToday: ordersToday.count,
        revenueToday: parseFloat(revenueTodayResult.total) || 0,
        totalRevenue: parseFloat(totalRevenueResult.total) || 0,
      };
    } catch (error: any) {
      console.error('Error getting admin stats:', error);
      throw new Error('Failed to get admin stats');
    }
  }

  async getAllOrders(): Promise<any[]> {
    try {
      // First get all orders
      const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
      
      // For each order, get its items with product details
      const ordersWithItemDetails = await Promise.all(
        allOrders.map(async (order) => {
          const items = await db.select({
            id: orderItems.id,
            quantity: orderItems.quantity,
            price: orderItems.price,
            productName: products.name,
            product: {
              id: products.id,
              name: products.name,
              description: products.description,
              price: products.price,
              type: products.type,
              category: products.category
            }
          })
          .from(orderItems)
          .innerJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id));

          return {
            ...order,
            items
          };
        })
      );

      // Filter out orders with no items (only return orders that have actual purchases)
      return ordersWithItemDetails.filter(order => order.items && order.items.length > 0);
    } catch (error: any) {
      console.error('Error getting all orders:', error);
      throw new Error('Failed to get orders');
    }
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    try {
      const result = await db.update(orders)
        .set({ status })
        .where(eq(orders.id, orderId))
        .returning();

      if (result.length === 0) {
        throw new Error('Order not found');
      }

      return result[0];
    } catch (error: any) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    try {
      const result = await db.insert(products).values(productData).returning();
      return result[0];
    } catch (error: any) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  async updateProduct(productId: number, productData: Partial<InsertProduct>): Promise<Product> {
    try {
      const result = await db.update(products)
        .set(productData)
        .where(eq(products.id, productId))
        .returning();

      if (result.length === 0) {
        throw new Error('Product not found');
      }

      return result[0];
    } catch (error: any) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  async deleteProduct(productId: number): Promise<void> {
    try {
      await db.delete(products).where(eq(products.id, productId));
    } catch (error: any) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }
}

export const storage = new DatabaseStorage();