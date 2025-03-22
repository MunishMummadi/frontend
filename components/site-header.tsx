import Link from "next/link"
import { Heart } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Input } from "@/components/ui/input"
import { SavedProvidersDialog } from "@/components/saved-providers-dialog"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Healthspot</span>
        </Link>

        <div className="flex-1 mx-4 md:mx-8">
          <div className="relative w-full max-w-md">
            <Input type="search" placeholder="Search for hospitals, clinics, or services..." className="w-full" />
          </div>
        </div>

        <nav className="ml-auto flex gap-4 items-center">
          <SavedProvidersDialog />
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}

