"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Utensils,
    Search,
    Trash2,
    MoreHorizontal,
    Star,
    ChefHat,
    ShoppingBag,
    Banknote
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
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";
import { ApiResponse, Meal } from "@/types";
import { toast } from "sonner";
import { getMediaUrl } from "@/lib/utils";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function AdminMealsPage() {
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<Meal | null>(null);
    const queryClient = useQueryClient();

    const { data: mealsData, isLoading, error } = useQuery({
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

    const stats = [
        {
            label: "Catalog Depth",
            value: totalMeals,
            color: "text-blue-500",
            icon: Utensils
        },
        {
            label: "Ready to Serve",
            value: availableMeals,
            color: "text-emerald-500",
            icon: ChefHat
        },
        {
            label: "Average Basket",
            value: `৳${avgPrice}`,
            color: "text-amber-500",
            icon: Banknote
        }
    ];

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <EmptyState
                    icon={Utensils}
                    title="Error loading menu"
                    description="The global meal catalog is currently unreachable. Please try again."
                >
                    <Button onClick={() => window.location.reload()} className="mt-4 rounded-xl font-bold border-2" variant="outline">Refresh Catalog</Button>
                </EmptyState>
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Global Meal Catalog</h1>
                    <p className="text-muted-foreground mt-1 font-medium italic">Monitor and manage every dish served on FoodHub.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="border-border bg-card rounded-[2rem] shadow-sm overflow-hidden group hover:border-primary/20 transition-all">
                            <CardContent className="pt-8 pb-8 px-8 flex items-center justify-between">
                                <div>
                                    <div className={`text-4xl font-black ${stat.color} tabular-nums tracking-tighter`}>
                                        {stat.value}
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">{stat.label}</p>
                                </div>
                                <div className={`p-4 rounded-2xl ${stat.color} bg-current/10 group-hover:scale-110 transition-transform`}>
                                    <Icon className="h-7 w-7" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search for meals, ingredients, or providers..."
                        className="pl-12 h-14 bg-card border-2 border-border rounded-2xl focus:border-primary/20 focus:ring-primary/10 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Badge variant="outline" className="h-10 px-6 rounded-2xl font-black border-2 text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-[10px] shrink-0">
                    Matches: {meals.length}
                </Badge>
            </div>

            {/* Meals Table */}
            <div className="rounded-[2.5rem] border-2 border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 border-b-2 border-border hover:bg-muted/30 transition-none">
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Dish Details</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Provider</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Category</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Price</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Rating</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-14 shrink-0 rounded-2xl bg-muted animate-pulse" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                                    <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell><div className="h-6 w-32 bg-muted animate-pulse rounded" /></TableCell>
                                        <TableCell><div className="h-8 w-24 bg-muted animate-pulse rounded-2xl" /></TableCell>
                                        <TableCell><div className="h-5 w-16 bg-muted animate-pulse rounded" /></TableCell>
                                        <TableCell><div className="h-5 w-16 bg-muted animate-pulse rounded" /></TableCell>
                                        <TableCell><div className="h-8 w-20 bg-muted animate-pulse rounded-2xl" /></TableCell>
                                        <TableCell className="text-right px-8"><div className="h-10 w-10 ml-auto bg-muted animate-pulse rounded-xl" /></TableCell>
                                    </TableRow>
                                ))
                            ) : meals.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-24 text-center">
                                        <EmptyState
                                            icon={Utensils}
                                            title="No meals found"
                                            description={search ? `No culinary matches for "${search}".` : "The platform menu is currently empty."}
                                        />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                meals.map((meal) => (
                                    <TableRow key={meal.id} className="hover:bg-muted/30 transition-all group/row border-b border-border/50">
                                        <TableCell className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-16 w-16 rounded-[1.25rem] border-2 border-border shadow-sm shrink-0 transition-transform group-hover/row:scale-110">
                                                    <AvatarImage src={getMediaUrl(meal.image)} alt={meal.name} className="object-cover" />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-black text-xs uppercase">
                                                        {meal.name.slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-foreground text-lg leading-tight group-hover/row:text-primary transition-colors">
                                                        {meal.name}
                                                    </span>
                                                    {meal.dietaryPreference && meal.dietaryPreference !== "REGULAR" && (
                                                        <Badge variant="outline" className="w-fit text-[10px] px-2 py-0.5 mt-1 border-primary/20 text-primary bg-primary/5 font-black uppercase tracking-widest rounded-lg">
                                                            {meal.dietaryPreference}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-6 text-sm text-muted-foreground font-black italic">
                                            {(meal as any).providerProfile?.businessName || "Private Kitchen"}
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <Badge className="rounded-xl px-4 py-1.5 font-bold border-2 border-primary/10 bg-muted/50 text-foreground">
                                                {(meal as any).category?.name || "Global"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-8 py-6 font-black text-foreground tabular-nums text-lg">
                                            ৳{meal.price.toFixed(0)}
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-amber-500 font-black tabular-nums text-lg">
                                                <Star className="h-4 w-4 fill-current" />
                                                {(meal.avgRating || 4.5).toFixed(1)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <StatusPill value={meal.isAvailable !== false ? "available" : "hidden"} />
                                        </TableCell>
                                        <TableCell className="px-8 py-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] p-3 shadow-2xl border-2 border-border">
                                                    <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Inventory Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="rounded-xl cursor-pointer py-3 px-3 font-bold">
                                                        <ShoppingBag className="mr-3 h-4 w-4 text-primary" /> View Analytics
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-2 bg-border/50" />
                                                    <DropdownMenuItem
                                                        className="text-rose-600 focus:text-rose-600 focus:bg-rose-600/10 rounded-xl cursor-pointer font-black py-3 px-3"
                                                        onClick={() => setDeleteTarget(meal)}
                                                    >
                                                        <Trash2 className="mr-3 h-4 w-4" /> Purge from Menu
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent className="rounded-[2rem] border-2">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black text-foreground">Purge Culinary Record?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base font-medium italic">
                            Are you sure you want to permanently remove <strong>{deleteTarget?.name}</strong> from the platform? This cannot be reversed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3">
                        <AlertDialogCancel className="rounded-xl font-bold h-12 border-2">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="rounded-xl font-bold h-12 bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-500/20"
                            onClick={() => deleteTarget && deleteMealMutation.mutate(deleteTarget.id)}
                        >
                            Confirm Purge
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
