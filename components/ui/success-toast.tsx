"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SuccessToastProps {
    message: string;
    onClose: () => void;
}

export function SuccessToast({ message, onClose }: SuccessToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5">
            <Card className="flex items-center gap-3 p-4 shadow-lg border-green-500/50 bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="font-medium text-green-900 dark:text-green-100">{message}</p>
                <button
                    onClick={onClose}
                    className="ml-4 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                >
                    <X className="h-4 w-4" />
                </button>
            </Card>
        </div>
    );
}
