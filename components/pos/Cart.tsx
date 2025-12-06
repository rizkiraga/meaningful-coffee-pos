import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CartProps {
    items: CartItem[];
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemoveItem: (id: string) => void;
    onCheckout: () => void;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="flex h-full flex-col bg-card">
            <div className="p-4 border-b">
                <h2 className="font-semibold text-lg">Current Order</h2>
            </div>

            <ScrollArea className="flex-1 p-4">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
                        <p>No items in cart</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence initial={false}>
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex items-start justify-between gap-4 py-2">
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.name}</h4>
                                            <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => onUpdateQuantity(item.id, -1)}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-4 text-center text-sm">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => onUpdateQuantity(item.id, 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={() => onRemoveItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </ScrollArea>

            <div className="mt-auto border-t p-4 bg-muted/10">
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax (10%)</span>
                        <span>{formatCurrency(total * 0.1)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{formatCurrency(total * 1.1)}</span>
                    </div>
                </div>
                <Button
                    className="w-full"
                    size="lg"
                    disabled={items.length === 0}
                    onClick={onCheckout}
                >
                    Checkout
                </Button>
            </div>
        </div>
    );
}
