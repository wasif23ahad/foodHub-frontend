"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Loader2,
    Utensils,
    Image as ImageIcon
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

    // Fetch meals
    const { data: meals, isLoading } = useQuery({
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

    // Reset form when editing or closing
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

    // Create/Update Mutation
    const upsertMutation = useMutation({
        mutationFn: async (values: MealFormValues) => {
            if (editingMeal) {
                return api.put(`/provider/meals/${editingMeal.id}`, values);
            }
            return api.post("/provider/meals", values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["provider-meals-own"] });
            toast.success(editingMeal ? "Meal updated" : "Meal created");
            setIsEditorOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.message || "Something went wrong");
        },
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return api.delete(`/provider/meals/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["provider-meals-own"] });
            toast.success("Meal deleted");
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
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (meals === null) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-6">
                    <Utensils className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Business Profile Required</h2>
                <p className="text-muted-foreground max-w-[400px]">
                    You need to complete your business profile before you can start managing your menu.
                </p>
                <Link href="/provider/profile" className="mt-4">
                    <Button>Setup Profile Now</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Add, edit, or remove meals from your restaurant's menu.
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add New Meal
                </Button>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50 transition-none">
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[100px]">Image</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meal Name</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dietary</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {meals?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-40 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                        <Utensils className="h-10 w-10 opacity-20" />
                                        <div className="space-y-1">
                                            <p className="font-semibold text-foreground text-base">No meals found</p>
                                            <p className="text-sm">Start by adding a delicious dish to your menu.</p>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="mt-2"
                                            onClick={() => handleOpenDialog()}
                                        >
                                            <Plus className="h-4 w-4 mr-2" /> Add Your First Meal
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            meals?.map((meal) => (
                                <TableRow key={meal.id} className="hover:bg-muted/30 transition-colors group/row">
                                    <TableCell className="px-4 py-4">
                                        <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-border bg-muted/50 flex items-center justify-center transition-transform group-hover/row:scale-105">
                                            {meal.image ? (
                                                <Image
                                                    src={getMediaUrl(meal.image)}
                                                    alt={meal.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <div className="font-semibold text-foreground leading-tight">{meal.name}</div>
                                        <div className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-[200px]">
                                            {meal.description}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground border border-border/50">
                                            {meal.category?.name || "Uncategorized"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <DietaryBadge value={meal.dietaryPreference || "REGULAR"} />
                                    </TableCell>
                                    <TableCell className="px-4 py-4 font-bold text-foreground tabular-nums">
                                        ৳ {meal.price}
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <StatusPill value={meal.isAvailable ? "available" : "hidden"} />
                                    </TableCell>
                                    <TableCell className="px-4 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted/80">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
                                                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleOpenDialog(meal)} className="rounded-lg cursor-pointer">
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-1" />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer font-medium"
                                                    onClick={() => {
                                                        setDeletingMeal(meal);
                                                        setIsDeleteAlertOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Meal
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

            {/* Create/Edit Modal */}
            <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingMeal ? "Edit Meal" : "Add New Meal"}</DialogTitle>
                        <DialogDescription>
                            {editingMeal ? "Update the details of your meal here." : "Fill in the details to add a new dish to your menu."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Spicy Chicken Burger" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price (৳)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories?.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Describe your meal..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meal Image</FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormDescription>Upload a delicious photo of your meal.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dietaryPreference"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dietary Preference</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select dietary preference" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="REGULAR">Regular</SelectItem>
                                                <SelectItem value="VEGETARIAN">Vegetarian</SelectItem>
                                                <SelectItem value="VEGAN">Vegan</SelectItem>
                                                <SelectItem value="GLUTEN_FREE">Gluten Free</SelectItem>
                                                <SelectItem value="KETO">Keto</SelectItem>
                                                <SelectItem value="HALAL">Halal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isAvailable"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Available for order</FormLabel>
                                            <FormDescription>
                                                Hide this meal from your menu if out of stock.
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
                            <DialogFooter className="pt-4">
                                <Button type="submit" disabled={upsertMutation.isPending}>
                                    {upsertMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingMeal ? "Update Meal" : "Create Meal"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the meal <span className="font-bold">{deletingMeal?.name}</span> and remove it from our listings.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingMeal(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90 text-white"
                            onClick={() => deletingMeal && deleteMutation.mutate(deletingMeal.id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
