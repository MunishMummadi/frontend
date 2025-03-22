"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the provider type
export type Provider = {
  id: number
  name: string
  address: string
  type: string
  rating: number
  reviews: number
  distance: string
  price: string
  hours: string
  phone: string
  insurance: string[]
}

type SavedProvidersContextType = {
  savedProviders: Provider[]
  addProvider: (provider: Provider) => void
  removeProvider: (providerId: number) => void
  isProviderSaved: (providerId: number) => boolean
}

const SavedProvidersContext = createContext<SavedProvidersContextType | undefined>(undefined)

export function SavedProvidersProvider({ children }: { children: ReactNode }) {
  const [savedProviders, setSavedProviders] = useState<Provider[]>([])

  // Load saved providers from localStorage on initial render
  useEffect(() => {
    const storedProviders = localStorage.getItem("savedProviders")
    if (storedProviders) {
      setSavedProviders(JSON.parse(storedProviders))
    }
  }, [])

  // Save to localStorage whenever savedProviders changes
  useEffect(() => {
    localStorage.setItem("savedProviders", JSON.stringify(savedProviders))
  }, [savedProviders])

  const addProvider = (provider: Provider) => {
    setSavedProviders((prev) => {
      // Check if provider already exists
      if (prev.some((p) => p.id === provider.id)) {
        return prev
      }
      return [...prev, provider]
    })
  }

  const removeProvider = (providerId: number) => {
    setSavedProviders((prev) => prev.filter((provider) => provider.id !== providerId))
  }

  const isProviderSaved = (providerId: number) => {
    return savedProviders.some((provider) => provider.id === providerId)
  }

  return (
    <SavedProvidersContext.Provider value={{ savedProviders, addProvider, removeProvider, isProviderSaved }}>
      {children}
    </SavedProvidersContext.Provider>
  )
}

export function useSavedProviders() {
  const context = useContext(SavedProvidersContext)
  if (context === undefined) {
    throw new Error("useSavedProviders must be used within a SavedProvidersProvider")
  }
  return context
}

