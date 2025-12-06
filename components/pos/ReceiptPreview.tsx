"use client";

import { Order } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";
import { useRef } from "react";

interface ReceiptPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export function ReceiptPreview({ open, onOpenChange, order }: ReceiptPreviewProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${order?.id}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              padding: 20px;
              max-width: 400px;
              margin: 0 auto;
            }
            .receipt-header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px dashed #000;
              padding-bottom: 10px;
            }
            .receipt-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .receipt-info {
              margin-bottom: 20px;
              font-size: 12px;
            }
            .receipt-items {
              margin-bottom: 20px;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              font-size: 14px;
            }
            .item-name {
              flex: 1;
            }
            .item-qty {
              width: 40px;
              text-align: center;
            }
            .item-price {
              width: 100px;
              text-align: right;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .total-section {
              margin-top: 20px;
              border-top: 2px dashed #000;
              padding-top: 10px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              font-size: 14px;
            }
            .total-row.grand-total {
              font-size: 18px;
              font-weight: bold;
              margin-top: 10px;
            }
            .receipt-footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 10px;
              border-top: 2px dashed #000;
              font-size: 12px;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (!order) return null;

  const subtotal = order.total_price;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Receipt Preview</DialogTitle>
        </DialogHeader>

        <div ref={receiptRef} className="font-mono text-sm">
          <div className="receipt-header text-center mb-4 pb-4 border-b-2 border-dashed">
            <div className="receipt-title text-2xl font-bold mb-2">Meaningful Coffee</div>
            <div className="text-xs">Coffee Shop Receipt</div>
          </div>

          <div className="receipt-info mb-4 text-xs">
            <div>Order ID: {order.id}</div>
            <div>Date: {new Date(order.created_at).toLocaleString('id-ID')}</div>
            <div>Payment: {order.payment_method.toUpperCase()}</div>
            <div>Status: {order.status.toUpperCase()}</div>
          </div>

          <div className="receipt-items mb-4">
            <div className="item-row font-bold border-b pb-2 mb-2">
              <div className="item-name">Item</div>
              <div className="item-qty">Qty</div>
              <div className="item-price">Price</div>
            </div>
            {order.items.map((item, index) => (
              <div key={index} className="item-row">
                <div className="item-name">{item.product?.name || `Product ${item.product_id}`}</div>
                <div className="item-qty">x{item.quantity}</div>
                <div className="item-price">{formatCurrency(item.subtotal)}</div>
              </div>
            ))}
          </div>

          <div className="total-section border-t-2 border-dashed pt-4">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="total-row">
              <span>Tax (10%):</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="total-row grand-total text-lg font-bold mt-2 pt-2 border-t">
              <span>TOTAL:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="receipt-footer text-center mt-4 pt-4 border-t-2 border-dashed text-xs">
            <div>Thank you for your purchase!</div>
            <div>Please come again</div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={handlePrint} className="flex-1 gap-2">
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
