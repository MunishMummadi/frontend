import { MapSection } from "@/components/map-section"
import { FilterSection } from "@/components/filter-section"
import { ReviewsSection } from "@/components/reviews-section"
import BackgroundPaths from "@/components/background-paths"

export default function Home() {
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar with filters */}
          <div className="lg:col-span-1">
            <FilterSection />
          </div>

          {/* Main content area with map and reviews */}
          <div className="lg:col-span-2 space-y-6">
            <MapSection />
            <ReviewsSection />
          </div>
        </div>
      </div>
    </main>
  )
}

