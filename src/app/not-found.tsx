import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-primary/10 p-6 rounded-full mb-6 text-primary">
                <Search className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 italic text-primary">404</h1>
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider">Page Not Found</h2>
            <p className="text-muted-foreground mb-10 max-w-sm mx-auto">
                Oops! The page you're looking for doesn't exist or has been moved to a new location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                    <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                        <Home className="h-4 w-4" /> Back to Home
                    </Button>
                </Link>
                <Link href="/meals">
                    <Button variant="outline" size="lg" className="gap-2">
                        Browse Meals
                    </Button>
                </Link>
            </div>
        </div>
    );
}
