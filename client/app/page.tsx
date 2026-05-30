"use client";

import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Footer from "@/components/home/Footer";
import { useAuth } from "@/contexts/AuthContext";
import PageLoader from "@/components/ui/PageLoader";

export default function Home() {
  const { user, isLoading } = useAuth();

  // Show loader while auth is being determined
  if (isLoading) {
    return <PageLoader  />; // or a skeleton layout
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <Footer />
    </div>
  )
}
// this page is a root page and should not be wrapped in a suspense boundary or evn wrap with auth cos both user and non user can see this page and it contain sestive stuff but imma us estatement to handle the loading state of the page and show a loader until the data is loaded