"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Utensils,
    Image as ImageIcon,
    Save,
    Sparkles,
    Banknote,
    Tag,
    ChefHat,
    Loader2,
    Search
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { StatusPill, DietaryBadge } from "@/components/dashboard/badges";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Meal, ApiResponse, Category } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { getMediaUrl } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";

const mealSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().min(1, "Price must be at least 1"),
    categoryId: z.string().min(1, "Please select a category"),
    image: z.string().optional(),
    dietaryPreference: z.string().min(1, "Please select a dietary preference"),
    isAvailable: z.boolean(),
});

type MealFormValues = z.infer<typeof mealSchema>;

export default function ProviderMenuPage() {
    const queryClient = useQueryClient();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
    const [deletingMeal, setDeletingMeal] = useState<Meal | null>(null);

    // Search and Pagination
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    // Reset to page 1 on search
    useEffect(() => {
        setPage(1);
    }, [search]);

    // Fetch meals
    const { data: meals, isLoading, error } = useQuery({
        queryKey: ["provider-meals-own"],
        queryFn: async () => {
            try {
                const res = await api.get<ApiResponse<Meal[]>>("/provider/meals");
                return res.data;
            } catch (err: any) {
                if (err.message?.includes("profile not found")) {
                    return null;
                }
                throw err;
            }
        },
    });

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await api.get<ApiResponse<Category[]>>("/categories");
            return res.data;
        },
    });

    const form = useForm<z.infer<typeof mealSchema>>({
        resolver: zodResolver(mealSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            categoryId: "",
            image: "",
            dietaryPreference: "REGULAR",
            isAvailable: true,
        },
    });

    const handleOpenDialog = (meal?: Meal) => {
        if (meal) {
            setEditingMeal(meal);
            form.reset({
                name: meal.name,
                description: meal.description || "",
                price: meal.price,
                categoryId: meal.categoryId,
                image: meal.image || "",
                dietaryPreference: meal.dietaryPreference || "REGULAR",
                isAvailable: meal.isAvailable,
            });
        } else {
            setEditingMeal(null);
            form.reset({
                name: "",
                description: "",
                price: 0,
                categoryId: "",
                image: "",
                dietaryPreference: "REGULAR",
                isAvailable: true,
            });
        }
        setIsEditorOpen(true);
    };

    const upsertMutation = useMutation({
        mutationFn: async (values: MealFormValues) => {
            if (editingMeal) {
                return api.put(`/provider/meals/${editingMeal.id}`, values);
            }
            return api.post("/provider/meals", values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["provider-meals-own"] });
            toast.success(editingMeal ? "Dish updated successfully" : "New dish added to menu");
            setIsEditorOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to save meal");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return api.delete(`/provider/meals/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["provider-meals-own"] });
            toast.success("Dish purged from menu");
            setIsDeleteAlertOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete meal");
        },
    });

    function onSubmit(values: MealFormValues) {
        upsertMutation.mutate(values);
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Sparkles className="h-10 w-10 animate-pulse text-primary" />
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Syncing Kitchen...</p>
            </div>
        );
    }

    if (meals === null) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <EmptyState
                    icon={ChefHat}
                    title="Business Profile Required"
                    description="You need to complete your business identity before serving meals to our community."
                >
                    <Link href="/provider/profile" className="mt-6">
                        <Button className="h-14 rounded-2xl px-8 font-black shadow-lg shadow-primary/20">Setup Kitchen Identity</Button>
                    </Link>
                </EmptyState>
            </div>
        );
    }

    const totalMeals = meals?.length || 0;
    const activeMeals = meals?.filter(m => m.isAvailable).length || 0;
    const avgPrice = totalMeals > 0 ? ((meals || []).reduce((s, m) => s + m.price, 0) / totalMeals).toFixed(0) : 0;

    const filteredMeals = (meals || []).filter(meal =>
        search === "" ||
        meal.name.toLowerCase().includes(search.toLowerCase()) ||
        meal.description?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredMeals.length / limit) || 1;
    const paginatedMeals = filteredMeals.slice((page - 1) * limit, page * limit);

    const stats = [
        { label: "Menu Items", value: totalMeals, color: "text-blue-500", icon: Utensils },
        { label: "On Air", value: activeMeals, color: "text-emerald-500", icon: Sparkles },
        { label: "Avg Price", value: `৳${avgPrice}`, color: "text-amber-500", icon: Banknote },
    ];

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Menu Catalog</h1>
                    <p className="text-muted-foreground mt-1 font-medium italic">Craft your culinary offering and manage item visibility.</p>
                </div>
                <Button 
                    onClick={() => handleOpenDialog()} 
                    className="h-14 rounded-2xl px-8 gap-3 font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus className="h-5 w-5" />
                    New Creation
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="border-border bg-card rounded-[2rem] shadow-sm overflow-hidden group">
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
                        placeholder="Search for dishes by name or description..."
                        className="pl-12 h-14 bg-card border-2 border-border rounded-2xl focus:border-primary/20 focus:ring-primary/10 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Badge variant="outline" className="h-10 px-6 rounded-2xl font-black border-2 text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-[10px] shrink-0">
                    Matches: {filteredMeals.length}
                </Badge>
            </div>

            <div className="rounded-[2.5rem] border-2 border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 border-b-2 border-border hover:bg-muted/30 transition-none">
                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Preview</TableHead>
                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Dish Name</TableHead>
                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Category</TableHead>
                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Dietary</TableHead>
                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Pricing</TableHead>
                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</TableHead>
                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {meals?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-32 text-center">
                                    <EmptyState
                                        icon={Utensils}
                                        title="Empty Kitchen"
                                        description="You haven't listed any dishes yet. Start serving today!"
                                    >
                                        <Button 
                                            className="mt-8 rounded-2xl font-black h-12 px-8 shadow-lg"
                                            onClick={() => handleOpenDialog()}
                                        >
                                            <Plus className="h-5 w-5 mr-2" /> Add Your First Meal
                                        </Button>
                                    </EmptyState>
                                </TableCell>
                            </TableRow>
                        ) : filteredMeals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-24 text-center">
                                    <EmptyState
                                        icon={Utensils}
                                        title="No dishes found"
                                        description={search ? `No culinary matches for "${search}".` : "The platform menu is currently empty."}
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedMeals.map((meal) => (
                                <TableRow key={meal.id} className="hover:bg-muted/30 transition-all group/row border-b border-border/50">
                                    <TableCell className="px-8 py-6">
                                        <div className="relative h-16 w-16 rounded-[1.25rem] overflow-hidden border-2 border-border bg-muted flex items-center justify-center transition-transform group-hover/row:scale-110">
                                            {meal.image ? (
                                                <Image
                                                    src={getMediaUrl(meal.image)}
                                                    alt={meal.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center gap-1 opacity-20">
                                                    <div className="text-[8px] font-black uppercase">No</div>
                                                    <div className="text-[8px] font-black uppercase">Image</div>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6">
                                        <div className="font-black text-foreground text-lg leading-tight group-hover/row:text-primary transition-colors">{meal.name}</div>
                                        <div className="text-[10px] text-muted-foreground mt-1 font-bold line-clamp-1 max-w-[200px] italic">
                                            {meal.description}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6">
                                        <Badge variant="outline" className="rounded-xl px-4 py-1.5 font-bold border-2 border-primary/10 bg-muted/50 text-foreground">
                                            {meal.category?.name || "Global"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-8 py-6">
                                        <DietaryBadge value={meal.dietaryPreference || "REGULAR"} />
                                    </TableCell>
                                    <TableCell className="px-8 py-6 font-black text-foreground tabular-nums text-lg">
                                        ৳{meal.price}
                                    </TableCell>
                                    <TableCell className="px-8 py-6">
                                        <StatusPill value={meal.isAvailable ? "available" : "hidden"} />
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] p-3 shadow-2xl border-2 border-border">
                                                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Item Controls</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleOpenDialog(meal)} className="rounded-xl cursor-pointer py-3 px-3 font-bold">
                                                    <Pencil className="mr-3 h-4 w-4 text-primary" /> Edit Dish Detail
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2 bg-border/50" />
                                                <DropdownMenuItem
                                                    className="text-rose-600 focus:text-rose-600 focus:bg-rose-600/10 rounded-xl cursor-pointer font-black py-3 px-3"
                                                    onClick={() => {
                                                        setDeletingMeal(meal);
                                                        setIsDeleteAlertOpen(true);
                                                    }}
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-card p-4 rounded-2xl border-2 border-border shadow-sm">
                    <div className="text-sm font-bold text-muted-foreground">
                        Showing page <span className="text-foreground">{page}</span> of <span className="text-foreground">{totalPages}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="rounded-xl font-bold border-2"
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-xl font-bold border-2"
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>

            {/* Create/Edit Modal */}
            <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <DialogContent className="sm:max-w-xl rounded-[2.5rem] border-2 p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black text-foreground">{editingMeal ? "Refine Creation" : "New Culinary Addition"}</DialogTitle>
                        <DialogDescription className="text-base font-medium italic">
                            {editingMeal ? "Update your dish with seasonal adjustments." : "Expand your menu with a fresh creation."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Display Name <span className="text-rose-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Traditional Beef Rezala" className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-xs font-bold ml-1" />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Retail Price (৳) <span className="text-rose-500">*</span></FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="number"
                                                        className="h-12 pl-10 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-black"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs font-bold ml-1" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Classification <span className="text-rose-500">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 rounded-2xl border-2 focus:ring-primary/20 bg-background font-bold">
                                                        <SelectValue placeholder="Select genre" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-2xl border-2">
                                                    {categories?.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id} className="rounded-xl font-bold py-2">
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs font-bold ml-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Chef's Description <span className="text-rose-500">*</span></FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Tell the story of this dish..." className="min-h-[100px] rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-xs font-bold ml-1" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Culinary Visual</FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs font-bold ml-1" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dietaryPreference"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Dietary Alignment</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 rounded-2xl border-2 focus:ring-primary/20 bg-background font-bold">
                                                    <SelectValue placeholder="Select dietary fit" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-2xl border-2">
                                                <SelectItem value="REGULAR" className="rounded-xl font-bold">Regular</SelectItem>
                                                <SelectItem value="VEGETARIAN" className="rounded-xl font-bold">Vegetarian</SelectItem>
                                                <SelectItem value="VEGAN" className="rounded-xl font-bold">Vegan</SelectItem>
                                                <SelectItem value="GLUTEN_FREE" className="rounded-xl font-bold">Gluten Free</SelectItem>
                                                <SelectItem value="KETO" className="rounded-xl font-bold">Keto</SelectItem>
                                                <SelectItem value="HALAL" className="rounded-xl font-bold">Halal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-xs font-bold ml-1" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isAvailable"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-3xl border-2 p-6 bg-muted/30">
                                        <div className="space-y-1">
                                            <FormLabel className="text-base font-black">Live Visibility</FormLabel>
                                            <FormDescription className="text-xs font-medium italic">
                                                Toggle availability based on kitchen stock.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="pt-6">
                                <Button type="submit" disabled={upsertMutation.isPending} className="h-14 rounded-2xl px-10 font-black shadow-lg shadow-primary/20">
                                    {upsertMutation.isPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    {editingMeal ? "Update dish" : "Add to Menu"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent className="rounded-[2.5rem] border-2 p-8">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black text-foreground">Purge from Kitchen?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base font-medium italic">
                            You are about to permanently delete <span className="font-black text-rose-600 not-italic">{deletingMeal?.name}</span>. This action is irreversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3 pt-6">
                        <AlertDialogCancel onClick={() => setDeletingMeal(null)} className="rounded-xl font-bold h-12">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black h-12 shadow-lg shadow-rose-500/20"
                            onClick={() => deletingMeal && deleteMutation.mutate(deletingMeal.id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Purging..." : "Confirm Purge"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}


