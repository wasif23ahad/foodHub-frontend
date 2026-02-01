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

const mealSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().min(1, "Price must be at least 1"),
    categoryId: z.string().min(1, "Please select a category"),
    image: z.string().url("Please enter a valid image URL").or(z.string().length(0)),
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
        queryKey: ["provider-meals"],
        queryFn: async () => {
            const res = await api.get<ApiResponse<Meal[]>>("/meals");
            return res.data;
        },
    });

    // Fetch categories
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await api.get<ApiResponse<Category[]>>("/categories");
            return res.data;
        },
    });

    const form = useForm<MealFormValues>({
        resolver: zodResolver(mealSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            categoryId: "",
            image: "",
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
                isAvailable: true,
            });
        }
        setIsEditorOpen(true);
    };

    // Create/Update Mutation
    const upsertMutation = useMutation({
        mutationFn: async (values: MealFormValues) => {
            if (editingMeal) {
                return api.put(`/meals/${editingMeal.id}`, values);
            }
            return api.post("/meals", values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["provider-meals"] });
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
            return api.delete(`/meals/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["provider-meals"] });
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

            <div className="border rounded-xl shadow-sm overflow-hidden bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Meal Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {meals?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    No meals found. Start by adding one!
                                </TableCell>
                            </TableRow>
                        ) : (
                            meals?.map((meal) => (
                                <TableRow key={meal.id}>
                                    <TableCell>
                                        <div className="relative h-12 w-12 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                                            {meal.image ? (
                                                <Image
                                                    src={meal.image}
                                                    alt={meal.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{meal.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {meal.category?.name || "Uncategorized"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-primary">৳ {meal.price}</TableCell>
                                    <TableCell>
                                        <Badge variant={meal.isAvailable ? "default" : "destructive"}>
                                            {meal.isAvailable ? "Available" : "Hidden"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleOpenDialog(meal)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => {
                                                        setDeletingMeal(meal);
                                                        setIsDeleteAlertOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
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

            {/* Create/Edit Modal */}
            <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <DialogContent className="sm:max-w-[500px]">
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
                                        <FormLabel>Image URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormDescription>Link to a delicious photo of your meal.</FormDescription>
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
