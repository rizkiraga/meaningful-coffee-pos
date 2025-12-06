import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/lib/utils";
import { CartItem } from "@/types";

interface CheckoutModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cart: CartItem[];
    onConfirm: (paymentMethod: 'cash' | 'qris', cashAmount?: number) => void;
}

export function CheckoutModal({ open, onOpenChange, cart, onConfirm }: CheckoutModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
    const [cashAmount, setCashAmount] = useState<string>("");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.1; // Including tax
    const change = paymentMethod === 'cash' && cashAmount ? parseInt(cashAmount) - total : 0;

    const handleConfirm = () => {
        onConfirm(paymentMethod, paymentMethod === 'cash' ? parseInt(cashAmount) : undefined);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Checkout</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total to Pay</span>
                        <span>{formatCurrency(total)}</span>
                    </div>

                    <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <RadioGroup
                            defaultValue="cash"
                            value={paymentMethod}
                            onValueChange={(v) => setPaymentMethod(v as 'cash' | 'qris')}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                                <Label
                                    htmlFor="cash"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    Cash
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="qris" id="qris" className="peer sr-only" />
                                <Label
                                    htmlFor="qris"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    QRIS / E-Wallet
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {paymentMethod === 'cash' && (
                        <div className="space-y-2">
                            <Label htmlFor="cash-amount">Cash Received</Label>
                            <Input
                                id="cash-amount"
                                type="number"
                                value={cashAmount}
                                onChange={(e) => setCashAmount(e.target.value)}
                                placeholder="Enter amount"
                            />
                            {parseInt(cashAmount) > 0 && (
                                <div className="flex justify-between text-sm mt-2">
                                    <span>Change</span>
                                    <span className={change < 0 ? "text-destructive" : "text-green-600"}>
                                        {formatCurrency(change)}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleConfirm}
                        disabled={paymentMethod === 'cash' && (!cashAmount || parseInt(cashAmount) < total)}
                        className="w-full"
                    >
                        Process Payment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
