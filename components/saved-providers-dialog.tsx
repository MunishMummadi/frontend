"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Bookmark, MapPin, Phone, Clock, DollarSign, Trash2 } from "lucide-react"
import { useSavedProviders } from "@/components/saved-providers-context"
import { ScrollArea } from "@/components/ui/scroll-area"

export function SavedProvidersDialog() {
  const [open, setOpen] = useState(false)
  const { savedProviders, removeProvider } = useSavedProviders()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Bookmark className="h-4 w-4" />
          <span>Saved</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Saved Healthcare Providers</DialogTitle>
          <DialogDescription>
            Your list of saved healthcare providers. You can remove providers from this list at any time.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {savedProviders.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Bookmark className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <p>You haven't saved any healthcare providers yet.</p>
              <p className="text-sm mt-1">Click the "Add to Saved" button on any provider to save it to this list.</p>
            </div>
          ) : (
            <div className="space-y-4 p-1">
              {savedProviders.map((provider) => (
                <div key={provider.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1 inline" />
                        {provider.address}
                      </p>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeProvider(provider.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>

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
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

