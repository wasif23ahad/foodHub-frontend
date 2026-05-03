"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Utensils,
    Search,
    Trash2,
    MoreHorizontal,
    Star,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { StatusPill } from "@/components/dashboard/badges";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { ApiResponse, Meal } from "@/types";
import { toast } from "sonner";
import { getMediaUrl } from "@/lib/utils";

export default function AdminMealsPage() {
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<Meal | null>(null);
    const queryClient = useQueryClient();

    const { data: mealsData, isLoading } = useQuery({
        queryKey: ["admin-meals"],
        queryFn: async () => {
            try {
                const res = await api.get<ApiResponse<Meal[]>>("/admin/meals?limit=100");
                return res.data;
            } catch (err) {
                console.error("Meals fetch failed", err);
                return [];
            }
        }
    });

    const deleteMealMutation = useMutation({
        mutationFn: async (mealId: string) => {
            return api.delete<ApiResponse<any>>(`/admin/meals/${mealId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-meals"] });
            toast.success("Meal deleted successfully");
            setDeleteTarget(null);
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to delete meal");
        }
    });

    const meals = (mealsData || []).filter(meal =>
        search === "" ||
        meal.name.toLowerCase().includes(search.toLowerCase()) ||
        meal.description?.toLowerCase().includes(search.toLowerCase())
    );

    const totalMeals = mealsData?.length || 0;
    const availableMeals = (mealsData || []).filter(m => m.isAvailable !== false).length;
    const avgPrice = totalMeals > 0
        ? ((mealsData || []).reduce((sum, m) => sum + m.price, 0) / totalMeals).toFixed(0)
        : "0";

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Meal Management</h1>
                <p className="text-muted-foreground mt-1">View and manage all meals across all providers.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-none shadow-md">
                    <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-blue-600">{totalMeals}</div>
                        <p className="text-sm text-muted-foreground mt-2">Total Meals</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-green-600">{availableMeals}</div>
                        <p className="text-sm text-muted-foreground mt-2">Available</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-amber-600">৳{avgPrice}</div>
                        <p className="text-sm text-muted-foreground mt-2">Average Price</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card className="shadow-sm border-muted">
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search meals by name or description..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Meals Table */}
            <Card className="shadow-sm border-muted overflow-hidden">
                <CardHeader className="pb-4">
                    <CardTitle>All Meals ({meals.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4 p-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : meals.length === 0 ? (
                        <div className="text-center py-20">
                            <Utensils className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                            <p className="font-semibold text-foreground">No meals found</p>
                            <p className="text-sm text-muted-foreground">Try adjusting your search terms.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50 transition-none">
                                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meal</TableHead>
                                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Provider</TableHead>
                                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</TableHead>
                                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</TableHead>
                                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating</TableHead>
                                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                                        <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {meals.map((meal) => (
                                        <TableRow key={meal.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-12 w-12 rounded-lg border border-border">
                                                        <AvatarImage src={getMediaUrl(meal.image)} alt={meal.name} className="object-cover" />
                                                        <AvatarFallback className="bg-primary/10 rounded-lg text-xs">
                                                            {meal.name.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-foreground leading-tight">{meal.name}</span>
                                                        {meal.dietaryPreference && meal.dietaryPreference !== "REGULAR" && (
                                                            <Badge variant="outline" className="w-fit text-[10px] px-1.5 h-4 leading-none mt-1 border-primary/20 text-primary bg-primary/5">
                                                                {meal.dietaryPreference}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 text-sm text-muted-foreground font-medium">
                                                {(meal as any).providerProfile?.businessName || "Unknown"}
                                            </TableCell>
                                            <TableCell className="px-4 py-4">
                                                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground border border-border/50">
                                                    {(meal as any).category?.name || "Uncategorized"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-4 font-bold text-foreground tabular-nums text-sm">
                                                ৳{meal.price.toFixed(0)}
                                            </TableCell>
                                            <TableCell className="px-4 py-4">
                                                <div className="flex items-center gap-1.5 text-sm font-medium">
                                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                    {(meal.avgRating || 4.5).toFixed(1)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-4">
                                                <StatusPill value={meal.isAvailable !== false ? "available" : "hidden"} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                            onClick={() => setDeleteTarget(meal)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete Meal
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Meal</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => deleteTarget && deleteMealMutation.mutate(deleteTarget.id)}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
