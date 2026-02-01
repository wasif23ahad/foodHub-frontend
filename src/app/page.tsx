import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { PopularMeals } from "@/components/home/popular-meals";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Categories />
      <PopularMeals />
    </div>
  );
}
