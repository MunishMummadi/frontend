"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Locate, Star, Clock, Phone, DollarSign, Bookmark, BookmarkCheck } from "lucide-react"
import { useSavedProviders, type Provider } from "@/components/saved-providers-context"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

// Mock data for healthcare providers
const mockProviders = [
  {
    id: 1,
    name: "City General Hospital",
    address: "123 Main St, Cityville",
    lat: 40.7128,
    lng: -74.006,
    rating: 4.5,
    reviews: 128,
    type: "Hospital",
    distance: "1.2 miles",
    price: "$$",
    hours: "Open 24 hours",
    phone: "(555) 123-4567",
    insurance: ["Medicare", "Blue Cross", "Aetna"],
  },
  {
    id: 2,
    name: "Westside Medical Center",
    address: "456 Oak Ave, Westside",
    lat: 40.7138,
    lng: -74.016,
    rating: 4.2,
    reviews: 86,
    type: "Medical Center",
    distance: "2.5 miles",
    price: "$$$",
    hours: "8:00 AM - 8:00 PM",
    phone: "(555) 987-6543",
    insurance: ["Medicare", "Medicaid", "UnitedHealthcare"],
  },
  {
    id: 3,
    name: "Eastside Urgent Care",
    address: "789 Pine St, Eastside",
    lat: 40.7148,
    lng: -73.996,
    rating: 3.8,
    reviews: 42,
    type: "Urgent Care",
    distance: "3.1 miles",
    price: "$$",
    hours: "9:00 AM - 9:00 PM",
    phone: "(555) 456-7890",
    insurance: ["Cigna", "Aetna"],
  },
]

export function MapSection() {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const mapRef = useRef(null)
  const { addProvider, removeProvider, isProviderSaved } = useSavedProviders()

  // In a real implementation, this would initialize a map library like Google Maps or Mapbox
  useEffect(() => {
    // Mock map initialization
    console.log("Map would be initialized here")

    // Set default selected provider
    if (mockProviders.length > 0) {
      setSelectedProvider(mockProviders[0])
    }
  }, [])

  const handleSaveProvider = (provider: Provider) => {
    if (isProviderSaved(provider.id)) {
      removeProvider(provider.id)
      toast({
        title: "Provider removed",
        description: `${provider.name} has been removed from your saved list.`,
      })
    } else {
      addProvider(provider)
      toast({
        title: "Provider saved",
        description: `${provider.name} has been added to your saved list.`,
        action: <ToastAction altText="View saved providers">View Saved</ToastAction>,
      })
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Healthcare Providers Near You
            </div>
            <Button variant="outline" size="sm" className="h-8">
              <Locate className="h-4 w-4 mr-2" />
              Current Location
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Map container */}
          <div
            ref={mapRef}
            className="w-full h-[400px] bg-gray-100 rounded-md mb-4 relative overflow-hidden"
            style={{
              backgroundImage: "url('/placeholder.svg?height=400&width=800')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* This would be replaced with an actual map component */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4 bg-white/80 rounded-lg">
                <p className="font-medium">Interactive Map</p>
                <p className="text-sm text-muted-foreground">Map would display here with markers for each provider</p>
              </div>
            </div>
          </div>

          {/* Provider list */}
          <div className="space-y-3">
            {mockProviders.map((provider) => (
              <div
                key={provider.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedProvider && selectedProvider.id === provider.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted"
                }`}
                onClick={() => setSelectedProvider(provider)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{provider.name}</h3>
                    <p className="text-sm text-muted-foreground">{provider.address}</p>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="mr-2">
                        {provider.type}
                      </Badge>
                      <span className="text-sm flex items-center">
                        <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                        {provider.rating} ({provider.reviews})
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-sm text-muted-foreground">{provider.distance}</span>
                    <div className="text-sm font-medium mt-1">{provider.price}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSaveProvider(provider)
                      }}
                    >
                      {isProviderSaved(provider.id) ? (
                        <>
                          <BookmarkCheck className="h-4 w-4 mr-1 text-primary" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4 mr-1" />
                          Add to Saved
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {selectedProvider && selectedProvider.id === provider.id && (
                  <div className="mt-3 pt-3 border-t grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {provider.hours}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {provider.phone}
                    </div>
                    <div className="flex items-center text-sm md:col-span-2">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      Insurance: {provider.insurance.join(", ")}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

