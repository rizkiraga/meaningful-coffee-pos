import { ResetDataButton } from "@/components/settings/ResetDataButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            </div>

            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Danger Zone</CardTitle>
                        <CardDescription>
                            Manage your application data and reset options.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-medium">Reset Demo Data</h3>
                                <p className="text-sm text-muted-foreground">
                                    Clear all local data including products, orders, and sales history.
                                    Useful for starting a fresh demo.
                                </p>
                            </div>
                            <ResetDataButton />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
