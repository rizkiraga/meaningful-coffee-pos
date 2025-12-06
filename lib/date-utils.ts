import { Order } from "@/types";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

export function filterOrdersByDateRange(
    orders: Order[],
    dateRange: DateRange | undefined
): Order[] {
    if (!dateRange?.from) return orders;

    const from = startOfDay(dateRange.from);
    const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

    return orders.filter((order) => {
        const orderDate = new Date(order.created_at);
        return isWithinInterval(orderDate, { start: from, end: to });
    });
}

export function getPresetDateRanges() {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    // This month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // This year
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear(), 11, 31);

    // Last 7 days
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);

    // Last 30 days
    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 30);

    return {
        today: { from: startOfToday, to: endOfToday },
        last7Days: { from: last7Days, to: endOfToday },
        last30Days: { from: last30Days, to: endOfToday },
        thisMonth: { from: startOfMonth, to: endOfMonth },
        thisYear: { from: startOfYear, to: endOfYear },
    };
}
