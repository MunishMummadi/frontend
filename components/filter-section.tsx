"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Filter, Star } from "lucide-react"

export function FilterSection() {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [distance, setDistance] = useState(10)

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Filter className="mr-2 h-5 w-5" />
          Filter Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Location filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Location</Label>
          <div className="flex space-x-2">
            <Select defaultValue="current">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Location</SelectItem>
                <SelectItem value="custom">Custom Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Distance filter */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-sm font-medium">Distance</Label>
            <span className="text-sm text-muted-foreground">{distance} miles</span>
          </div>
          <Slider defaultValue={[10]} max={50} step={1} onValueChange={(value) => setDistance(value[0])} />
        </div>

        {/* Price range filter */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-sm font-medium">Price Range</Label>
            <span className="text-sm text-muted-foreground">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
          <Slider defaultValue={[0, 500]} max={1000} step={10} onValueChange={(value) => setPriceRange(value)} />
        </div>

        {/* Service type filter */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="service-type">
            <AccordionTrigger className="text-sm font-medium py-2">Type of Service</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="primary-care" />
                  <Label htmlFor="primary-care">Primary Care</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="specialist" />
                  <Label htmlFor="specialist">Specialist</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="urgent-care" />
                  <Label htmlFor="urgent-care">Urgent Care</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="hospital" />
                  <Label htmlFor="hospital">Hospital</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="telemedicine" />
                  <Label htmlFor="telemedicine">Telemedicine</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Insurance filter */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="insurance">
            <AccordionTrigger className="text-sm font-medium py-2">Insurance Accepted</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="medicare" />
                  <Label htmlFor="medicare">Medicare</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="medicaid" />
                  <Label htmlFor="medicaid">Medicaid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="blue-cross" />
                  <Label htmlFor="blue-cross">Blue Cross Blue Shield</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="aetna" />
                  <Label htmlFor="aetna">Aetna</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="cigna" />
                  <Label htmlFor="cigna">Cigna</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="united" />
                  <Label htmlFor="united">UnitedHealthcare</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Rating filter */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="rating">
            <AccordionTrigger className="text-sm font-medium py-2">Minimum Rating</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="rating-5" />
                  <Label htmlFor="rating-5" className="flex items-center">
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rating-4" />
                  <Label htmlFor="rating-4" className="flex items-center">
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rating-3" />
                  <Label htmlFor="rating-3" className="flex items-center">
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="rating-2" />
                  <Label htmlFor="rating-2" className="flex items-center">
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Apply filters button */}
        <Button className="w-full">Apply Filters</Button>
      </CardContent>
    </Card>
  )
}

