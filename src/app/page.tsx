import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
        Welcome to Food<span className="text-primary">Hub</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl">
        Order delicious meals from the best local providers. Fresh, fast, and delivered to your doorstep.
      </p>
      <div className="flex gap-4">
        <Link href="/meals">
          <Button size="lg">Browse Meals</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg">Sign In</Button>
        </Link>
      </div>
    </div>
  );
}
