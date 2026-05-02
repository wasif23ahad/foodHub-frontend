"use client";

import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { PopularMeals } from "@/components/home/popular-meals";
import { HowItWorks } from "@/components/home/how-it-works";
import { StatsSection } from "@/components/home/stats-section";
import { FeaturedProviders } from "@/components/home/featured-providers";
import { PersonalizedMeals } from "@/components/home/personalized-meals";
import { WhyChooseFoodHub } from "@/components/home/why-choose-foodhub";
import { Testimonials } from "@/components/home/testimonials";
import { FAQSection } from "@/components/home/faq-section";
import { FinalCTA } from "@/components/home/final-cta";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col">
            <Hero />
            <StatsSection />
            <Categories />
            <PopularMeals />
            <PersonalizedMeals />
            <FeaturedProviders />
            <WhyChooseFoodHub />
            <Testimonials />
            <HowItWorks />
            <FAQSection />
            <FinalCTA />
        </main>
    );
}
