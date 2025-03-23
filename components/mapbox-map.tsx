"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Provider } from './saved-providers-context'

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoibXVuaXNobXVtbWFkaSIsImEiOiJjbThrenV6NzgwMDVqMm5vcTBic3ZmbWZpIn0.hg1LYOCF2t2fHPyUehOazw'

interface MapboxMapProps {
  providers: Provider[]
  center: { lat: number; lng: number }
  selectedProvider: Provider | null
  onMarkerClick: (provider: Provider) => void
}

export function MapboxMap({ providers, center, selectedProvider, onMarkerClick }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<{ [id: string]: mapboxgl.Marker }>({})
  const [mapInitialized, setMapInitialized] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(0)

  // Handle viewport resizing for responsiveness
  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth)
    }

    // Set initial viewport width
    updateViewportWidth()

    // Add resize listener
    window.addEventListener('resize', updateViewportWidth)

    // Cleanup
    return () => window.removeEventListener('resize', updateViewportWidth)
  }, [])

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return

    // Correct the orientation by ensuring proper bearing and pitch settings
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [center.lng, center.lat],
      zoom: 12,
      bearing: 0, // Ensure proper orientation with 0 rotation
      pitch: 0,   // Ensure flat view initially
      attributionControl: false, // We'll add a custom attribution control
      preserveDrawingBuffer: true // Important for screenshots/sharing
    })

    // Add attribution control in a better position
    map.current.addControl(new mapboxgl.AttributionControl({
      compact: true
    }), 'bottom-left')

    // Add navigation controls (zoom in/out) with better positioning
    map.current.addControl(new mapboxgl.NavigationControl({
      showCompass: true,
      visualizePitch: true
    }), 'top-right')

    // Add user location control with improved positioning
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    )

    // Add fullscreen control for better user experience
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')

    // Set map loaded flag
    map.current.on('load', () => {
      setMapInitialized(true)
      
      // Reset orientation when loaded to ensure proper north alignment
      if (map.current) {
        map.current.resetNorthPitch({ duration: 1000 })
      }
    })

    // Handle errors gracefully
    map.current.on('error', (e) => {
      console.error("Mapbox error:", e.error)
    })

    // Clean up on unmount
    return () => {
      if (map.current) map.current.remove()
      // Clear all markers
      Object.values(markersRef.current).forEach(marker => marker.remove())
      markersRef.current = {}
    }
  }, [])

  // Update map center when center prop changes
  useEffect(() => {
    if (map.current && center.lat && center.lng) {
      map.current.flyTo({
        center: [center.lng, center.lat],
        essential: true,
        zoom: 12,
        bearing: 0, // Reset orientation on center change
        duration: 1000 // Smooth transition
      })
    }
  }, [center.lat, center.lng])

  // Resize handler to ensure map fills container correctly
  useEffect(() => {
    if (map.current) {
      map.current.resize()
    }
  }, [viewportWidth])

  // Add markers for providers
  useEffect(() => {
    if (!map.current || !mapInitialized || !providers.length) return

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove())
    markersRef.current = {}

    // Add new markers
    providers.forEach((provider, index) => {
      if (!provider.lat || !provider.lng || !map.current) return

      // Create marker element
      const el = document.createElement('div')
      el.className = 'marker'
      el.innerHTML = `<div class="marker-label">${index + 1}</div>`
      el.style.backgroundColor = 'red'
      el.style.color = 'white'
      el.style.borderRadius = '50%'
      el.style.width = '36px'
      el.style.height = '36px'
      el.style.display = 'flex'
      el.style.justifyContent = 'center'
      el.style.alignItems = 'center'
      el.style.fontWeight = 'bold'
      el.style.cursor = 'pointer'
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
      el.style.border = '2px solid white'
      el.style.transition = 'all 0.2s ease'
      
      // If this provider is selected, highlight it
      if (selectedProvider && selectedProvider.id === provider.id) {
        el.style.backgroundColor = '#0066FF'
        el.style.width = '42px'
        el.style.height = '42px'
        el.style.zIndex = '2'
        el.style.border = '3px solid white'
        el.style.transform = 'scale(1.1)'
      }

      // Create and add the marker
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom', // Bottom of marker aligns with the coordinates point
        offset: [0, -3]   // Small offset for better visual alignment
      })
        .setLngLat([
          typeof provider.lng === 'string' ? parseFloat(provider.lng) : provider.lng,
          typeof provider.lat === 'string' ? parseFloat(provider.lat) : provider.lat
        ])
        .addTo(map.current)

      // Add click event
      el.addEventListener('click', () => {
        onMarkerClick(provider)
      })
      
      // Add hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.1)'
      })
      
      el.addEventListener('mouseleave', () => {
        if (!(selectedProvider && selectedProvider.id === provider.id)) {
          el.style.transform = 'scale(1)'
        }
      })

      // Store marker reference
      markersRef.current[provider.id] = marker
    })

    // Fit map to markers if we have multiple providers
    if (providers.length > 1 && map.current) {
      const bounds = new mapboxgl.LngLatBounds()
      providers.forEach(provider => {
        if (provider.lat && provider.lng) {
          bounds.extend([
            typeof provider.lng === 'string' ? parseFloat(provider.lng) : provider.lng,
            typeof provider.lat === 'string' ? parseFloat(provider.lat) : provider.lat
          ])
        }
      })
      
      map.current.fitBounds(bounds, {
        padding: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        },
        maxZoom: 14,
        bearing: 0 // Keep north orientation when fitting bounds
      })
    }
  }, [providers, selectedProvider, mapInitialized, onMarkerClick])

  return (
    <div className="map-container-wrapper w-full relative" style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <div 
        ref={mapContainer} 
        className="mapbox-container w-full h-full" 
        style={{ 
          width: '100%', 
          height: viewportWidth < 768 ? '350px' : viewportWidth < 1024 ? '400px' : '500px',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }} 
      />
      {!mapInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded-md">
          <div className="animate-pulse">Loading map...</div>
        </div>
      )}
    </div>
  )
}
