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
import { FilterSection, type FilterOptions } from "@/components/filter-section"

// Base URL for backend API
const API_BASE_URL = "http://localhost:3001/api/maps";

// Fallback center coordinates (San Francisco)
const DEFAULT_CENTER = {
  lat: 37.7749,
  lng: -122.4194
};

// Extended provider interface with additional properties from API
interface ExtendedProvider extends Provider {
  openNow?: boolean;
  priceLevel?: string;
  website?: string;
}

function MapSectionContent({ filters: externalFilters }: { filters?: FilterOptions }) {
  const [providers, setProviders] = useState<ExtendedProvider[]>([])
  const [selectedProvider, setSelectedProvider] = useState<ExtendedProvider | null>(null)
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [activeMarker, setActiveMarker] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Filter state - now synchronized with external filters
  const [filters, setFilters] = useState<FilterOptions>({
    type: "any",
    specialty: "any",
    priceRange: "any",
    radius: 5000,
    insurance: [] as string[],
    minRating: 0
  })
  const [filtersApplied, setFiltersApplied] = useState(false)
  
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
          
          // Load providers near this location with any active filters
          fetchProvidersNearLocation(latitude, longitude, filters)
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
  }, [filters])
  
  // Load providers near a location using backend API
  const fetchProvidersNearLocation = async (lat: number, lng: number, filterOptions = filters) => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log(`Fetching providers near: ${lat}, ${lng} with filters:`, filterOptions);
      
      // Build query params with all filter options
      let url = `${API_BASE_URL}/providers?lat=${lat}&lng=${lng}`;
      
      // Add radius parameter
      url += `&radius=${filterOptions.radius}`;
      
      // Add type filter if not 'any'
      if (filterOptions.type !== 'any') {
        url += `&type=${encodeURIComponent(filterOptions.type)}`;
      }
      
      // Add specialty filter if not 'any'
      if (filterOptions.specialty !== 'any') {
        url += `&specialty=${encodeURIComponent(filterOptions.specialty)}`;
      }
      
      // Add price range filter if not 'any'
      if (filterOptions.priceRange !== 'any') {
        url += `&priceRange=${encodeURIComponent(filterOptions.priceRange)}`;
      }
      
      // Add insurance filters if any selected
      if (filterOptions.insurance && filterOptions.insurance.length > 0) {
        filterOptions.insurance.forEach(insurance => {
          url += `&insurance=${encodeURIComponent(insurance)}`;
        });
      }
      
      // Add min rating filter if specified
      if (filterOptions.minRating > 0) {
        url += `&minRating=${filterOptions.minRating}`;
      }
      
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
      const formattedProviders: ExtendedProvider[] = (data.providers || []).map((provider: any) => ({
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
          description: `We couldn't find healthcare providers in this area ${filtersApplied ? "with the current filters" : ""}. ${filtersApplied ? "Try changing your filters." : "Try a different location or search term."}`,
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
  const fetchDefaultProviders = async (filterOptions = filters) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Use the unified providers endpoint with a default query
      let url = `${API_BASE_URL}/providers?query=healthcare provider`;
      
      // Add filters if applied
      if (filterOptions.type !== 'any') {
        url += `&type=${encodeURIComponent(filterOptions.type)}`;
      }
      
      if (filterOptions.specialty !== 'any') {
        url += `&specialty=${encodeURIComponent(filterOptions.specialty)}`;
      }
      
      if (filterOptions.priceRange !== 'any') {
        url += `&priceRange=${encodeURIComponent(filterOptions.priceRange)}`;
      }
      
      // Add insurance filters if any selected
      if (filterOptions.insurance && filterOptions.insurance.length > 0) {
        filterOptions.insurance.forEach(insurance => {
          url += `&insurance=${encodeURIComponent(insurance)}`;
        });
      }
      
      // Add min rating filter if specified
      if (filterOptions.minRating > 0) {
        url += `&minRating=${filterOptions.minRating}`;
      }
      
      const response = await fetch(url);
      
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
      const formattedProviders: ExtendedProvider[] = (data.providers || []).map((provider: any) => ({
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
        action: <ToastAction altText="Try again" onClick={() => fetchDefaultProviders()}>Try Again</ToastAction>,
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setFiltersApplied(true);
    
    // Apply the new filters
    if (userLocation) {
      fetchProvidersNearLocation(userLocation.lat, userLocation.lng, newFilters);
    } else {
      fetchDefaultProviders(newFilters);
    }
  };
  
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
      
      // Add current filters
      if (filters.type !== 'any') {
        url += `&type=${encodeURIComponent(filters.type)}`;
      }
      
      if (filters.specialty !== 'any') {
        url += `&specialty=${encodeURIComponent(filters.specialty)}`;
      }
      
      if (filters.priceRange !== 'any') {
        url += `&priceRange=${encodeURIComponent(filters.priceRange)}`;
      }
      
      // Add insurance filters if any selected
      if (filters.insurance && filters.insurance.length > 0) {
        filters.insurance.forEach(insurance => {
          url += `&insurance=${encodeURIComponent(insurance)}`;
        });
      }
      
      // Add min rating filter if specified
      if (filters.minRating > 0) {
        url += `&minRating=${filters.minRating}`;
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
        const formattedProviders: ExtendedProvider[] = data.providers.map((provider: any) => ({
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
  const handleProviderSelect = (provider: ExtendedProvider) => {
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
  const handleSaveProvider = (provider: ExtendedProvider) => {
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
  const handleMarkerClick = (provider: ExtendedProvider) => {
    setSelectedProvider(provider)
    setActiveMarker(String(provider.id))
  }

  // Load providers on initial render
  useEffect(() => {
    getCurrentLocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Listen for search query parameter changes
  useEffect(() => {
    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      // If search param exists, perform the search
      performSearch(searchQuery)
    }
  }, [searchParams])
  
  // Update internal filters when external filters change
  useEffect(() => {
    if (externalFilters) {
      setFilters(externalFilters);
      setFiltersApplied(true);
      
      // Apply the new filters
      if (userLocation) {
        fetchProvidersNearLocation(userLocation.lat, userLocation.lng, externalFilters);
      } else {
        fetchDefaultProviders(externalFilters);
      }
    }
  }, [externalFilters]);

  return (
    <div className="grid gap-6">
      {/* Map and Provider Details */}
      <div className="space-y-6">
        <Card className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Map</span>
              <div className="flex items-center gap-2">
                {isLoading && <span className="text-sm font-normal">Loading...</span>}
                
                {/* Location Button */}
                {userLocation ? (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      if (userLocation) {
                        fetchProvidersNearLocation(userLocation.lat, userLocation.lng, filters)
                        setMapCenter(userLocation)
                      }
                    }}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Locate className="h-4 w-4" />
                    <span>Refresh Nearby</span>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={getCurrentLocation}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Locate className="h-4 w-4" />
                    <span>Use My Location</span>
                  </Button>
                )}
              </div>
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
                        onClick={() => fetchDefaultProviders()}
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

        {/* Selected provider details */}
        {selectedProvider && (
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{selectedProvider.name}</h3>
                <p className="text-muted-foreground">{selectedProvider.address}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={isProviderSaved(selectedProvider.id) ? 'text-primary' : ''}
                onClick={() => handleSaveProvider(selectedProvider)}
              >
                {isProviderSaved(selectedProvider.id) ? (
                  <BookmarkCheck className="h-5 w-5" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              {selectedProvider.rating && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  <span>{selectedProvider.rating} ({selectedProvider.reviews || 0} reviews)</span>
                </div>
              )}
              
              {selectedProvider.openNow !== undefined && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{selectedProvider.openNow ? 'Open now' : 'Closed'}</span>
                </div>
              )}
              
              {selectedProvider.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href={`tel:${selectedProvider.phone}`} className="hover:underline">{selectedProvider.phone}</a>
                </div>
              )}
              
              {selectedProvider.priceLevel && (
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>{'$'.repeat(parseInt(selectedProvider.priceLevel))}</span>
                </div>
              )}
            </div>
            
            {selectedProvider.website && (
              <div className="mt-4">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a href={selectedProvider.website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function MapSection({ filters }: { filters?: FilterOptions }) {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <MapSectionContent filters={filters} />
    </Suspense>
  )
}

export { MapSection }
