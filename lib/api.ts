import { Product, Order } from "@/types";
import { MOCK_PRODUCTS } from "./mock-data";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    products: {
        list: async (): Promise<Product[]> => {
            await delay(500);
            return [...MOCK_PRODUCTS];
        },
        create: async (product: Omit<Product, "id">): Promise<Product> => {
            await delay(500);
            const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
            MOCK_PRODUCTS.push(newProduct);
            return newProduct;
        },
        update: async (id: string, product: Partial<Product>): Promise<Product> => {
            await delay(500);
            const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
            if (index !== -1) {
                MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...product };
                return MOCK_PRODUCTS[index];
            }
            throw new Error("Product not found");
        },
        delete: async (id: string): Promise<void> => {
            await delay(500);
            const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
            if (index !== -1) {
                MOCK_PRODUCTS.splice(index, 1);
            }
        },
    },
    orders: {
        create: async (order: Omit<Order, "id" | "created_at">): Promise<Order> => {
            await delay(800);
            const newOrder: Order = {
                ...order,
                id: Math.random().toString(36).substr(2, 9),
                created_at: new Date().toISOString(),
            };

            // Save to localStorage
            if (typeof window !== 'undefined') {
                const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
                existingOrders.unshift(newOrder); // Add to beginning
                localStorage.setItem('orders', JSON.stringify(existingOrders));
            }

            console.log("Order created:", newOrder);
            return newOrder;
        },
        list: async (): Promise<Order[]> => {
            await delay(500);
            // Retrieve from localStorage
            if (typeof window !== 'undefined') {
                const orders = JSON.parse(localStorage.getItem('orders') || '[]');
                return orders;
            }
            return [];
        }
    },
    dashboard: {
        getStats: async () => {
            await delay(500);

            // Get real orders from localStorage
            let orders: Order[] = [];
            if (typeof window !== 'undefined') {
                orders = JSON.parse(localStorage.getItem('orders') || '[]');
            }

            // Calculate real statistics
            const totalSales = orders.reduce((sum, order) => sum + order.total_price, 0);
            const totalOrders = orders.length;
            const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

            // Group sales by hour
            const salesByHour: { [key: string]: number } = {};
            orders.forEach(order => {
                const hour = new Date(order.created_at).getHours();
                const timeKey = `${hour.toString().padStart(2, '0')}:00`;
                salesByHour[timeKey] = (salesByHour[timeKey] || 0) + order.total_price;
            });

            // Create sales by time array
            const salesByTime = Object.entries(salesByHour)
                .map(([time, sales]) => ({ time, sales }))
                .sort((a, b) => a.time.localeCompare(b.time));

            // Calculate top products
            const productSales: { [key: string]: { sales: number; revenue: number } } = {};
            orders.forEach(order => {
                order.items.forEach(item => {
                    const productName = item.product?.name || `Product ${item.product_id}`;
                    if (!productSales[productName]) {
                        productSales[productName] = { sales: 0, revenue: 0 };
                    }
                    productSales[productName].sales += item.quantity;
                    productSales[productName].revenue += item.subtotal;
                });
            });

            const topProducts = Object.entries(productSales)
                .map(([name, data]) => ({ name, ...data }))
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 4);

            return {
                totalSales,
                totalOrders,
                averageOrderValue,
                salesByTime: salesByTime.length > 0 ? salesByTime : [
                    { time: '08:00', sales: 0 },
                    { time: '12:00', sales: 0 },
                    { time: '18:00', sales: 0 },
                ],
                topProducts: topProducts.length > 0 ? topProducts : [
                    { name: 'No sales yet', sales: 0, revenue: 0 },
                ]
            };
        },
        calculateStatsFromOrders: (orders: Order[]) => {
            // Calculate real statistics
            const totalSales = orders.reduce((sum, order) => sum + order.total_price, 0);
            const totalOrders = orders.length;
            const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

            // Group sales by hour
            const salesByHour: { [key: string]: number } = {};
            orders.forEach(order => {
                const hour = new Date(order.created_at).getHours();
                const timeKey = `${hour.toString().padStart(2, '0')}:00`;
                salesByHour[timeKey] = (salesByHour[timeKey] || 0) + order.total_price;
            });

            // Create sales by time array
            const salesByTime = Object.entries(salesByHour)
                .map(([time, sales]) => ({ time, sales }))
                .sort((a, b) => a.time.localeCompare(b.time));

            // Calculate top products
            const productSales: { [key: string]: { sales: number; revenue: number } } = {};
            orders.forEach(order => {
                order.items.forEach(item => {
                    const productName = item.product?.name || `Product ${item.product_id}`;
                    if (!productSales[productName]) {
                        productSales[productName] = { sales: 0, revenue: 0 };
                    }
                    productSales[productName].sales += item.quantity;
                    productSales[productName].revenue += item.subtotal;
                });
            });

            const topProducts = Object.entries(productSales)
                .map(([name, data]) => ({ name, ...data }))
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 4);

            return {
                totalSales,
                totalOrders,
                averageOrderValue,
                salesByTime: salesByTime.length > 0 ? salesByTime : [
                    { time: '08:00', sales: 0 },
                    { time: '12:00', sales: 0 },
                    { time: '18:00', sales: 0 },
                ],
                topProducts: topProducts.length > 0 ? topProducts : [
                    { name: 'No sales yet', sales: 0, revenue: 0 },
                ]
            };
        }
    }
};
