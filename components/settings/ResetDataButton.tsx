"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export function ResetDataButton() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleReset = async () => {
        setIsLoading(true);
        try {
            // Clear all localStorage data
            localStorage.clear();

            // Simulate a small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast({
                title: "Data Reset Successful",
                description: "All application data has been cleared. The page will reload.",
            });

            // Reload the page to reset state
            window.location.reload();
        } catch (error) {
            console.error("Failed to reset data", error);
            toast({
                title: "Error",
                description: "Failed to reset data. Please try again.",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    Reset Demo Data
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your
                        products, orders, and sales history from this browser.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {isLoading ? "Resetting..." : "Yes, delete everything"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
