"use client"

import Link from "next/link"
import { Heart, Search } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Input } from "@/components/ui/input"
import { SavedProvidersDialog } from "@/components/saved-providers-dialog"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

export function SiteHeader() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  
  // Handle search submit
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    
    // Navigate to homepage with search query parameter
    router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`)
  }, [searchTerm, router])
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Healthspot</span>
        </Link>

        <div className="flex-1 mx-4 md:mx-8">
          <form onSubmit={handleSearch} className="relative w-full max-w-md flex">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search for hospitals, clinics, or services..." 
                className="w-full pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit" className="ml-2">Search</Button>
          </form>
        </div>

        <nav className="ml-auto flex gap-4 items-center">
          <SavedProvidersDialog />
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}
