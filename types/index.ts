export type Category = 'coffee' | 'non-coffee' | 'snack';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  total_price: number;
  payment_method: 'cash' | 'qris';
  created_at: string;
  status: 'paid' | 'void';
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  subtotal: number;
  product?: Product;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'cashier';
}
