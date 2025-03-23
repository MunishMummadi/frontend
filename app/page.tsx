"use client"

import { useState } from "react"
import { MapSection } from "@/components/map-section"
import { FilterSection, type FilterOptions } from "@/components/filter-section"
import { ReviewsSection } from "@/components/reviews-section"
import BackgroundPaths from "@/components/background-paths"

export default function Home() {
  // Create shared filter state to connect components
  const [filters, setFilters] = useState<FilterOptions>({
    type: "any",
    specialty: "any",
    priceRange: "any",
    radius: 5000,
    insurance: [],
    minRating: 0
  });

  // Handler for filter changes from the sidebar
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <main className="flex flex-col min-h-screen relative">
      {/* Background component positioned as a fixed background */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <BackgroundPaths title="Healthspot" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-8">
          Find the right healthcare provider with <span className="text-primary">Healthspot</span>
        </h1>
        
        <p className="text-center mb-6 text-muted-foreground">
          Use the filters on the left to find healthcare providers by type, specialty, and insurance acceptance
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar with filters */}
          <div className="lg:col-span-1">
            <FilterSection 
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>

          {/* Main content area with map and reviews */}
          <div className="lg:col-span-2 space-y-6">
            <MapSection filters={filters} />
            <ReviewsSection />
          </div>
        </div>
      </div>
    </main>
  )
}
