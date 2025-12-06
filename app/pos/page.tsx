"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { Cart } from "@/components/pos/Cart";
import { CheckoutModal } from "@/components/pos/CheckoutModal";
import { ReceiptPreview } from "@/components/pos/ReceiptPreview";
import { api } from "@/lib/api";
import { Product, CartItem, Order } from "@/types";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { SuccessToast } from "@/components/ui/success-toast";
import { PageTransition } from "@/components/layout/PageTransition";

export default function POSPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.products.list();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const handleUpdateQuantity = (id: string, delta: number) => {
        setCart((prev) => {
            return prev.map((item) => {
                if (item.id === id) {
                    const newQuantity = item.quantity + delta;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
                }
                return item;
            });
        });
    };

    const handleRemoveItem = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const handleCheckout = () => {
        setIsCheckoutOpen(true);
    };

    const handleConfirmCheckout = async (paymentMethod: 'cash' | 'qris', cashAmount?: number) => {
        try {
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const newOrder = await api.orders.create({
                user_id: 'user-1', // Mock user ID
                total_price: total,
                payment_method: paymentMethod,
                status: 'paid',
                items: cart.map(item => ({
                    id: Math.random().toString(36).substr(2, 9),
                    order_id: '',
                    product_id: item.id,
                    quantity: item.quantity,
                    subtotal: item.price * item.quantity,
                    product: {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        category: item.category,
                        image: item.image
                    }
                }))
            });

            setSuccessMessage(`Order processed successfully! Payment: ${paymentMethod.toUpperCase()}`);
            setShowSuccessToast(true);
            setCurrentOrder(newOrder);
            setCart([]);
            setIsCheckoutOpen(false);
            setIsReceiptOpen(true);
        } catch (error) {
            console.error("Checkout failed", error);
            setSuccessMessage("Failed to process order");
            setShowSuccessToast(true);
        }
    };

    const categories = ["all", "coffee", "non-coffee", "snack"];

    return (
        <PageTransition>
            <div className="flex h-full gap-4 p-4">
                <div className="flex flex-1 flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        }`}
                                >
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto rounded-lg border bg-background p-4 shadow-sm">
                        {isLoading ? (
                            <div className="flex h-full items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
                        )}
                    </div>
                </div>

                <div className="w-[350px] shrink-0 rounded-lg border shadow-sm overflow-hidden">
                    <Cart
                        items={cart}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                        onCheckout={handleCheckout}
                    />
                </div>

                <CheckoutModal
                    open={isCheckoutOpen}
                    onOpenChange={setIsCheckoutOpen}
                    cart={cart}
                    onConfirm={handleConfirmCheckout}
                />

                {showSuccessToast && (
                    <SuccessToast
                        message={successMessage}
                        onClose={() => setShowSuccessToast(false)}
                    />
                )}

                <ReceiptPreview
                    open={isReceiptOpen}
                    onOpenChange={setIsReceiptOpen}
                    order={currentOrder}
                />
            </div>
        </PageTransition>
    );
}
