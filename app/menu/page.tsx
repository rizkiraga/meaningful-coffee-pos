"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductFormDialog } from "@/components/menu/ProductFormDialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

export default function MenuPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>();

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

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSave = async (productData: Omit<Product, "id"> & { id?: string }) => {
        try {
            if (productData.id) {
                await api.products.update(productData.id, productData);
            } else {
                await api.products.create(productData);
            }
            await fetchProducts();
            setEditingProduct(undefined);
        } catch (error) {
            console.error("Failed to save product", error);
            alert("Failed to save product");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.products.delete(id);
            await fetchProducts();
        } catch (error) {
            console.error("Failed to delete product", error);
            alert("Failed to delete product");
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setEditingProduct(undefined);
        setIsFormOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell className="capitalize">{product.category}</TableCell>
                                <TableCell>{formatCurrency(product.price)}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(product)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <ProductFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                product={editingProduct}
                onSave={handleSave}
            />
        </div>
    );
}
