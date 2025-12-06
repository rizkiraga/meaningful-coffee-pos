"use client";

import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { api } from "@/lib/api";
import { Order } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FileDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { exportOrdersToExcel } from "@/lib/export-excel";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { filterOrdersByDateRange } from "@/lib/date-utils";

export default function OrdersPage() {
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await api.orders.list();
                setAllOrders(data);
                setFilteredOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        const filtered = filterOrdersByDateRange(allOrders, dateRange);
        setFilteredOrders(filtered);
    }, [allOrders, dateRange]);

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
                <h2 className="text-3xl font-bold tracking-tight">Order History</h2>
                <div className="flex items-center gap-2">
                    <DateRangePicker
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                    />
                    {filteredOrders.length > 0 && (
                        <Button onClick={() => exportOrdersToExcel(filteredOrders)} className="gap-2">
                            <FileDown className="h-4 w-4" />
                            Export to Excel
                        </Button>
                    )}
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center">
                        <p className="text-muted-foreground">No orders yet</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Orders will appear here after checkout
                        </p>
                    </div>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Payment Method</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-sm">{order.id}</TableCell>
                                    <TableCell>
                                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </TableCell>
                                    <TableCell>{order.items.length} items</TableCell>
                                    <TableCell className="uppercase">{order.payment_method}</TableCell>
                                    <TableCell>{formatCurrency(order.total_price)}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === 'paid' ? 'default' : 'secondary'}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
