import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MealSkeleton() {
    return (
        <Card className="overflow-hidden border-none shadow-sm h-full flex flex-col">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4 flex-1 space-y-3">
                <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
                <Skeleton className="h-4 w-1/2 mt-4" />
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </CardFooter>
        </Card>
    );
}
