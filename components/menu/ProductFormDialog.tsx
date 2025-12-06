"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, Category } from "@/types";

interface ProductFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product;
    onSave: (product: Omit<Product, "id"> & { id?: string }) => void;
}

export function ProductFormDialog({ open, onOpenChange, product, onSave }: ProductFormDialogProps) {
    const [formData, setFormData] = useState({
        name: product?.name || "",
        price: product?.price?.toString() || "",
        category: product?.category || "coffee" as Category,
        image: product?.image || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: product?.id,
            name: formData.name,
            price: parseFloat(formData.price),
            category: formData.category,
            image: formData.image,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price (IDR)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value as Category })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="coffee">Coffee</SelectItem>
                                    <SelectItem value="non-coffee">Non-Coffee</SelectItem>
                                    <SelectItem value="snack">Snack</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input
                                id="image"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="https://..."
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save Product</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
