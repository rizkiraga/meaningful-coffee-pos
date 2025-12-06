"use client";

import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { api } from "@/lib/api";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopProducts } from "@/components/dashboard/TopProducts";
import { Banknote, ShoppingBag, CreditCard, Loader2, FileDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { exportDashboardToExcel } from "@/lib/export-excel";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/layout/PageTransition";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { filterOrdersByDateRange, getPresetDateRanges } from "@/lib/date-utils";
import { Order } from "@/types";

interface DashboardStats {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    salesByTime: { time: string; sales: number }[];
    topProducts: { name: string; sales: number; revenue: number }[];
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orders = await api.orders.list();
                setAllOrders(orders);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filteredOrders = filterOrdersByDateRange(allOrders, dateRange);
        const data = api.dashboard.calculateStatsFromOrders(filteredOrders);
        setStats(data);
    }, [allOrders, dateRange]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!stats) {
        return <div>Failed to load stats</div>;
    }

    return (
        <PageTransition>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <div className="flex items-center gap-2">
                        <DateRangePicker
                            dateRange={dateRange}
                            onDateRangeChange={setDateRange}
                        />
                        <Button onClick={() => exportDashboardToExcel(stats)} className="gap-2">
                            <FileDown className="h-4 w-4" />
                            Export to Excel
                        </Button>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <StatsCard
                        title="Total Revenue"
                        value={formatCurrency(stats.totalSales)}
                        icon={Banknote}
                        description="+20.1% from last month"
                    />
                    <StatsCard
                        title="Orders"
                        value={stats.totalOrders.toString()}
                        icon={ShoppingBag}
                        description="+180.1% from last month"
                    />
                    <StatsCard
                        title="Avg. Order Value"
                        value={formatCurrency(stats.averageOrderValue)}
                        icon={CreditCard}
                        description="+19% from last month"
                    />

                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <SalesChart data={stats.salesByTime} />
                    <TopProducts data={stats.topProducts} />
                </div>
            </div>
        </PageTransition>
    );
}
