import * as XLSX from 'xlsx';
import { Order } from '@/types';
import { formatCurrency } from './utils';

export function exportOrdersToExcel(orders: Order[]) {
    // Prepare data for Excel
    const data = orders.map((order, index) => ({
        'No': index + 1,
        'Order ID': order.id,
        'Date': new Date(order.created_at).toLocaleString('id-ID'),
        'Payment Method': order.payment_method.toUpperCase(),
        'Status': order.status.toUpperCase(),
        'Items Count': order.items.length,
        'Subtotal': order.total_price,
        'Tax (10%)': order.total_price * 0.1,
        'Total': order.total_price + (order.total_price * 0.1),
    }));

    // Calculate summary
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
    const totalTax = totalRevenue * 0.1;
    const grandTotal = totalRevenue + totalTax;

    // Add summary rows
    data.push({} as any); // Empty row
    data.push({
        'No': '',
        'Order ID': 'SUMMARY',
        'Date': '',
        'Payment Method': '',
        'Status': '',
        'Items Count': '',
        'Subtotal': totalRevenue,
        'Tax (10%)': totalTax,
        'Total': grandTotal,
    } as any);

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths
    worksheet['!cols'] = [
        { wch: 5 },  // No
        { wch: 12 }, // Order ID
        { wch: 20 }, // Date
        { wch: 15 }, // Payment Method
        { wch: 10 }, // Status
        { wch: 12 }, // Items Count
        { wch: 15 }, // Subtotal
        { wch: 15 }, // Tax
        { wch: 15 }, // Total
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders Report');

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `MeaningfulCoffee_Report_${date}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);
}

export function exportDashboardToExcel(stats: any) {
    // Sales by time data
    const salesData = stats.salesByTime.map((item: any) => ({
        'Time': item.time,
        'Sales': item.sales,
    }));

    // Top products data
    const productsData = stats.topProducts.map((item: any, index: number) => ({
        'Rank': index + 1,
        'Product Name': item.name,
        'Quantity Sold': item.sales,
        'Revenue': item.revenue,
    }));

    // Summary data
    const summaryData = [
        { 'Metric': 'Total Revenue', 'Value': stats.totalSales },
        { 'Metric': 'Total Orders', 'Value': stats.totalOrders },
        { 'Metric': 'Average Order Value', 'Value': stats.averageOrderValue },
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Add summary sheet
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Add sales by time sheet
    const salesSheet = XLSX.utils.json_to_sheet(salesData);
    salesSheet['!cols'] = [{ wch: 10 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, salesSheet, 'Sales by Time');

    // Add top products sheet
    const productsSheet = XLSX.utils.json_to_sheet(productsData);
    productsSheet['!cols'] = [{ wch: 8 }, { wch: 20 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, productsSheet, 'Top Products');

    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const filename = `MeaningfulCoffee_Dashboard_${date}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);
}
