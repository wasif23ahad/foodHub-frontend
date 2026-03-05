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
                        <div className="space-y-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : meals.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No meals found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Meal</TableHead>
                                        <TableHead>Provider</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {meals.map((meal) => (
                                        <TableRow key={meal.id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 rounded-lg">
                                                        <AvatarImage src={getMediaUrl(meal.image)} alt={meal.name} className="object-cover" />
                                                        <AvatarFallback className="bg-primary/10 rounded-lg text-xs">
                                                            {meal.name.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{meal.name}</span>
                                                        {meal.dietaryPreference && meal.dietaryPreference !== "REGULAR" && (
                                                            <Badge variant="outline" className="w-fit text-[10px] px-1 leading-tight mt-0.5">
                                                                {meal.dietaryPreference}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {(meal as any).providerProfile?.businessName || "Unknown"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs">
                                                    {(meal as any).category?.name || "Uncategorized"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-bold text-sm">
                                                ৳{meal.price.toFixed(0)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                    {(meal.avgRating || 4.5).toFixed(1)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={meal.isAvailable !== false ? "bg-green-100 text-green-800 border-none" : "bg-gray-100 text-gray-800 border-none"}>
                                                    {meal.isAvailable !== false ? "Available" : "Unavailable"}
                                                </Badge>
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
