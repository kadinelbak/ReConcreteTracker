import { 
  users, products, videos, cartItems, orders, orderItems,
  type User, type InsertUser, type Product, type InsertProduct,
  type Video, type InsertVideo, type CartItem, type InsertCartItem,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

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
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    return order || undefined;
  }

  // Admin methods

  async getAdminStats(): Promise<any> {
    try {
      const [totalProducts] = await db.select({ count: sql`count(*)` }).from(products);
      const [activeProducts] = await db.select({ count: sql`count(*)` }).from(products).where(eq(products.isActive, true));
      const [totalOrders] = await db.select({ count: sql`count(*)` }).from(orders);

      // Calculate today's revenue
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [revenueToday] = await db
        .select({ sum: sql`coalesce(sum(${orders.total}), 0)` })
        .from(orders)
        .where(sql`${orders.createdAt} >= ${today.toISOString()}`);

      return {
        totalProducts: totalProducts.count,
        activeProducts: activeProducts.count,
        totalOrders: totalOrders.count,
        revenueToday: parseFloat(revenueToday.sum) || 0,
      };
    } catch (error: any) {
      console.error('Error getting admin stats:', error);
      throw new Error('Failed to get admin stats');
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      const result = await db.select().from(orders).orderBy(orders.createdAt);
      return result;
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
      const result = await db.delete(products).where(eq(products.id, productId));
      if (result.rowsAffected === 0) {
        throw new Error('Product not found');
      }
    } catch (error: any) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }
}

export const storage = new DatabaseStorage();