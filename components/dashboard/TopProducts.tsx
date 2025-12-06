import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface TopProductsProps {
    data: { name: string; sales: number; revenue: number }[];
}

export function TopProducts({ data }: TopProductsProps) {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {item.sales} sales
                                </p>
                            </div>
                            <div className="ml-auto font-medium">{formatCurrency(item.revenue)}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
