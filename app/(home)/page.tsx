"use client";
import CoreValuesSection from "@/components/home/CoreValuesSection";
import Footer from "@/components/home/Footer";
import Banner from "@/components/home/Banner";
import HomeTestimonials from "@/components/home/HomeTestimonial";
import OurServices from "@/components/home/OurServices";
import OurImpact from "@/components/home/OurImpact";
import TopBanner from "@/components/home/TopBanner";

export default function HomePage() {
  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen w-full flex flex-col mt-27 ">
    
        <TopBanner />
        <CoreValuesSection />
        <OurServices />
        <OurImpact />
        <HomeTestimonials />
        <Banner
        title="Ready to Make a Difference?"
        subtitle="Join us in creating a sustainable future through responsible waste management."
        buttonText="Get Started Today"
        redirectTo="/sign-in" 
       />
      
    </main>
  );
}
