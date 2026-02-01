import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { PopularMeals } from "@/components/home/popular-meals";
import { HowItWorks } from "@/components/home/how-it-works";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Categories />
      <PopularMeals />
      <HowItWorks />
    </div>
  );
}
