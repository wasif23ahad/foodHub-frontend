import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { PopularMeals } from "@/components/home/popular-meals";
import { WhyChooseFoodHub } from "@/components/home/why-choose-foodhub";
import { HowItWorks } from "@/components/home/how-it-works";
import { StatsSection } from "@/components/home/stats-section";
import { FeaturedProviders } from "@/components/home/featured-providers";
import { Testimonials } from "@/components/home/testimonials";
import { FAQSection } from "@/components/home/faq-section";
import { FinalCTA } from "@/components/home/final-cta";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <StatsSection />
      <Categories />
      <PopularMeals />
      <FeaturedProviders />
      <WhyChooseFoodHub />
      <Testimonials />
      <HowItWorks />
      <FAQSection />
      <FinalCTA />
    </div>
  );
}
