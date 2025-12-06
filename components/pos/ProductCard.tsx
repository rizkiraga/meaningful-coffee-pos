import Image from "next/image";
import { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Card className="group overflow-hidden transition-all hover:shadow-xl border-2 hover:border-primary/50">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                            {product.category}
                        </Badge>
                    </div>
                </div>
                <CardContent className="p-4 space-y-3">
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                        <p className="text-xl font-bold text-primary">{formatCurrency(product.price)}</p>
                    </div>
                    <Button
                        className="w-full gap-2"
                        onClick={() => onAddToCart(product)}
                        size="lg"
                    >
                        <Plus className="h-4 w-4" />
                        Add to Cart
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}
