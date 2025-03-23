"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, Locate, Star, Clock, Phone, 
  DollarSign, Bookmark, BookmarkCheck
} from "lucide-react"
import { useSavedProviders, type Provider } from "@/components/saved-providers-context"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useSearchParams } from "next/navigation"
import { MapboxMap } from "@/components/mapbox-map"

// Base URL for backend API
const API_BASE_URL = "http://localhost:3001/api/maps";

// Fallback center coordinates (San Francisco)
const DEFAULT_CENTER = {
  lat: 37.7749,
  lng: -122.4194
};

function MapSectionContent() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [activeMarker, setActiveMarker] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { savedProviders, addProvider, removeProvider, isProviderSaved } = useSavedProviders()
  const searchParams = useSearchParams()
  
  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const currentLocation = { lat: latitude, lng: longitude }
          setUserLocation(currentLocation)
          setMapCenter(currentLocation)
          
          // Load providers near this location
          fetchProvidersNearLocation(latitude, longitude)
        },
        (error) => {
          console.error("Error getting location:", error)
          setError("Unable to get your location. Please try searching instead.")
          setIsLoading(false)
          // Load default providers if location access is denied
          fetchDefaultProviders()
        }
      )
    } else {
      setError("Geolocation is not supported by your browser")
      // Load default providers if geolocation is not supported
      fetchDefaultProviders()
    }
  }, [])
  
  // Load providers near a location using backend API
  const fetchProvidersNearLocation = async (lat: number, lng: number) => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log(`Fetching providers near: ${lat}, ${lng}`);
      
      // Use the updated unified providers endpoint with more parameters handled by backend
      const url = `${API_BASE_URL}/providers?lat=${lat}&lng=${lng}&radius=5000`;
      console.log(`Calling API: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log(`API response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error response: ${errorText}`);
        
        let errorMessage = 'Failed to fetch nearby providers';
        
        try {
          // Try to parse as JSON if possible
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If parsing fails, use the raw text or default message
          if (errorText) {
            errorMessage = errorText;
          }
        }
        
        // Show error in toast
        toast({
          title: "Error connecting to server",
          description: errorMessage,
          variant: "destructive",
          action: <ToastAction altText="Try again" onClick={() => fetchProvidersNearLocation(lat, lng)}>Try Again</ToastAction>,
        });
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log("Provider data received:", data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Make sure all provider IDs are treated as strings
      const formattedProviders: Provider[] = (data.providers || []).map((provider: any) => ({
        ...provider,
        id: String(provider.id || provider.placeId) // Ensure ID is a string, using placeId as fallback
      }));
      
      setProviders(formattedProviders);
      
      // If we have a center from the API, use it
      if (data.center) {
        setMapCenter(data.center);
      }
      
      if (formattedProviders.length > 0) {
        setSelectedProvider(formattedProviders[0]);
        setActiveMarker(String(formattedProviders[0].id));
      } else {
        // Show a helpful message if no providers were found
        toast({
          title: "No providers found",
          description: "We couldn't find healthcare providers in this area. Try a different location or search term.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      console.error("Failed to fetch nearby providers:", err)
      setError(err.message || "Unable to fetch healthcare providers. Please try again later.")
      setProviders([])
      
      // Show error toast
      toast({
        title: "Error",
        description: err.message || "Failed to load providers. Please try again.",
        variant: "destructive",
        action: <ToastAction altText="Try again" onClick={getCurrentLocation}>Try Again</ToastAction>,
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Fetch default providers
  const fetchDefaultProviders = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Use the unified providers endpoint with a default query
      const response = await fetch(`${API_BASE_URL}/providers?query=healthcare provider`);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to fetch providers';
        
        try {
          // Try to parse as JSON if possible
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If parsing fails, use the raw text or default message
          if (errorText) {
            errorMessage = errorText;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Make sure all provider IDs are treated as strings
      const formattedProviders: Provider[] = (data.providers || []).map((provider: any) => ({
        ...provider,
        id: String(provider.id || provider.placeId) // Ensure ID is a string, using placeId as fallback
      }));
      
      setProviders(formattedProviders);
      
      // If we have a center from the API, use it
      if (data.center) {
        setMapCenter(data.center);
      }
      
      if (formattedProviders.length > 0) {
        setSelectedProvider(formattedProviders[0]);
        setActiveMarker(String(formattedProviders[0].id));
      }
    } catch (err: any) {
      console.error("Failed to fetch default providers:", err)
      setError(err.message || "Unable to fetch healthcare providers. Please try again later.")
      setProviders([])
      
      // Show error toast
      toast({
        title: "Error",
        description: err.message || "Failed to load providers. Please try again.",
        variant: "destructive",
        action: <ToastAction altText="Try again" onClick={fetchDefaultProviders}>Try Again</ToastAction>,
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Listen for search query parameter changes
  useEffect(() => {
    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      // If search param exists, perform the search
      performSearch(searchQuery)
    }
  }, [searchParams])
  
  // Search for providers by query
  const performSearch = async (query: string) => {
    if (!query.trim()) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      // Use the unified providers endpoint with a query and current location if available
      let url = `${API_BASE_URL}/providers?query=${encodeURIComponent(query)}`;
      
      // Add location parameters if available to improve search results
      if (userLocation) {
        url += `&lat=${userLocation.lat}&lng=${userLocation.lng}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Search failed';
        
        try {
          // Try to parse as JSON if possible
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If parsing fails, use the raw text or default message
          if (errorText) {
            errorMessage = errorText;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.providers || data.providers.length === 0) {
        setError(`No healthcare providers found for "${query}"`)
        setProviders([])
        
        // Show toast for no results
        toast({
          title: "No results found",
          description: `We couldn't find any results for "${query}". Try different keywords.`,
          variant: "default",
        })
      } else {
        // Make sure all provider IDs are treated as strings
        const formattedProviders: Provider[] = data.providers.map((provider: any) => ({
          ...provider,
          id: String(provider.id || provider.placeId) // Ensure ID is a string, using placeId as fallback
        }));
        
        setProviders(formattedProviders)
        setSelectedProvider(formattedProviders[0])
        setActiveMarker(String(formattedProviders[0].id))
        
        // Center map on search results
        if (data.center) {
          setMapCenter(data.center)
        }
        
        // Show success toast
        toast({
          title: "Search complete",
          description: `Found ${formattedProviders.length} healthcare providers for "${query}"`,
          variant: "default",
        })
      }
    } catch (err: any) {
      console.error("Search failed:", err)
      setError(err.message || "Search failed. Please try again later.")
      setProviders([])
      
      // Show error toast
      toast({
        title: "Search error",
        description: err.message || "Failed to search providers. Please try again.",
        variant: "destructive",
        action: <ToastAction altText="Try again" onClick={() => performSearch(query)}>Try Again</ToastAction>,
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle provider selection
  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider)
    setActiveMarker(String(provider.id))
    
    // Center map on this provider
    if (provider.lat && provider.lng) {
      setMapCenter({ 
        lat: typeof provider.lat === 'string' ? parseFloat(provider.lat) : provider.lat, 
        lng: typeof provider.lng === 'string' ? parseFloat(provider.lng) : provider.lng 
      })
    }
  }
  
  // Save/unsave provider
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
  
  // Handle marker click on map
  const handleMarkerClick = (provider: Provider) => {
    setSelectedProvider(provider)
    setActiveMarker(String(provider.id))
  }

  // Load providers on initial render
  useEffect(() => {
    getCurrentLocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Map</span>
            {isLoading && <span className="text-sm font-normal">Loading...</span>}
            {userLocation ? (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  if (userLocation) {
                    fetchProvidersNearLocation(userLocation.lat, userLocation.lng)
                    setMapCenter(userLocation)
                  }
                }}
                className="ml-auto flex items-center gap-1 text-xs"
              >
                <Locate className="h-4 w-4" />
                <span>Refresh Nearby</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={getCurrentLocation}
                className="ml-auto flex items-center gap-1 text-xs"
              >
                <Locate className="h-4 w-4" />
                <span>Use My Location</span>
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed p-10 text-center">
              <div>
                <p className="mb-2 text-sm text-muted-foreground">{error}</p>
                <Button 
                  size="sm" 
                  onClick={() => {
                    if (userLocation) {
                      fetchProvidersNearLocation(userLocation.lat, userLocation.lng)
                    } else {
                      fetchDefaultProviders()
                    }
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full rounded-md overflow-hidden">
              {providers.length > 0 ? (
                <div className="w-full h-full min-h-[350px] md:min-h-[400px] lg:min-h-[500px]">
                  <MapboxMap
                    providers={providers}
                    center={mapCenter}
                    selectedProvider={selectedProvider}
                    onMarkerClick={handleMarkerClick}
                  />
                </div>
              ) : (
                <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                  <div className="text-center">
                    <p className="mb-2 text-sm text-muted-foreground">No healthcare providers found</p>
                    <Button 
                      size="sm" 
                      onClick={fetchDefaultProviders}
                    >
                      Show Recommended Providers
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h3 className="font-medium mb-2">Nearby Providers</h3>
          <div className="h-[350px] overflow-y-auto pr-1 space-y-2">
            {providers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No providers found</p>
            ) : (
              providers.map(provider => (
                <div
                  key={provider.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${activeMarker === String(provider.id) ? 'bg-primary/10 border-primary' : ''}`}
                  onClick={() => handleProviderSelect(provider)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{provider.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {provider.address}
                      </p>
                    </div>
                    <Badge variant="outline">{provider.type}</Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span>
                        {provider.rating} ({provider.reviews})
                      </span>
                    </div>
                    <span>{provider.distance}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="md:col-span-2">
          {selectedProvider && (
            <div className="p-4 border rounded-md h-full">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{selectedProvider.name}</h3>
                  <p className="text-muted-foreground">{selectedProvider.address}</p>
                </div>
                <Badge>{selectedProvider.type}</Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{selectedProvider.rating} ({selectedProvider.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{selectedProvider.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{selectedProvider.hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{selectedProvider.phone}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Accepted Insurance</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.insurance && selectedProvider.insurance.map((ins, i) => (
                    <Badge key={i} variant="outline">{ins}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex justify-end gap-2">
                <Button 
                  variant="outline"
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedProvider.address.replace(/ /g, '+')}`)}
                >
                  Get Directions
                </Button>
                {isProviderSaved(selectedProvider.id) ? (
                  <Button 
                    variant="default"
                    onClick={() => handleSaveProvider(selectedProvider)}
                  >
                    <BookmarkCheck className="h-4 w-4 mr-2" /> Saved
                  </Button>
                ) : (
                  <Button 
                    variant="default"
                    onClick={() => handleSaveProvider(selectedProvider)}
                  >
                    <Bookmark className="h-4 w-4 mr-2" /> Save
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Wrapped in Suspense boundary for useSearchParams hook
export function MapSection() {
  return (
    <Suspense fallback={<div>Loading map section...</div>}>
      <MapSectionContent />
    </Suspense>
  )
}
