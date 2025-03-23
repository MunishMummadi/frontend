"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Filter, Star, ArrowRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Provider types and specialties - matching those in map-section.tsx
const PROVIDER_TYPES = [
  { value: "any", label: "Any Type" },
  { value: "hospital", label: "Hospital" },
  { value: "doctor", label: "Doctor" },
  { value: "dentist", label: "Dentist" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "physiotherapist", label: "Physiotherapist" }
];

const SPECIALTIES = [
  { value: "any", label: "Any Specialty" },
  { value: "general", label: "General Practice" },
  { value: "cardiology", label: "Cardiology" },
  { value: "dermatology", label: "Dermatology" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "neurology", label: "Neurology" }
];

const PRICE_RANGES = [
  { value: "any", label: "Any Price" },
  { value: "1", label: "$" },
  { value: "2", label: "$$" },
  { value: "3", label: "$$$" },
  { value: "4", label: "$$$$" }
];

const INSURANCE_OPTIONS = [
  { id: "medicare", label: "Medicare" },
  { id: "medicaid", label: "Medicaid" },
  { id: "bluecross", label: "Blue Cross" },
  { id: "aetna", label: "Aetna" },
  { id: "cigna", label: "Cigna" },
  { id: "united", label: "UnitedHealthcare" }
];

// Type definitions for the filter options
export interface FilterOptions {
  type: string;
  specialty: string;
  priceRange: string;
  radius: number;
  insurance: string[];
  minRating: number;
}

// Props for the FilterSection component
interface FilterSectionProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
}

export function FilterSection({ onFilterChange, initialFilters }: FilterSectionProps) {
  // Initialize filter state with defaults or initial values
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || {
    type: "any",
    specialty: "any",
    priceRange: "any",
    radius: 5000,
    insurance: [],
    minRating: 0
  });
  
  // Formatting function for distance in km/miles
  const formatDistance = (meters: number): string => {
    const km = meters / 1000;
    const miles = km * 0.621371;
    return `${km.toFixed(1)}km (${miles.toFixed(1)} miles)`;
  }

  // Update filter state when initialFilters change
  useEffect(() => {
    if (initialFilters) {
      setFilters({
        type: initialFilters.type || "any",
        specialty: initialFilters.specialty || "any",
        priceRange: initialFilters.priceRange || "any",
        radius: initialFilters.radius || 5000,
        insurance: initialFilters.insurance || [],
        minRating: initialFilters.minRating || 0
      });
    }
  }, [initialFilters]);

  // Handler for updating filter values
  const handleFilterChange = (filterType: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  // Toggle insurance selection
  const toggleInsurance = (insuranceId: string) => {
    setFilters(prev => {
      const currentInsurance = [...prev.insurance];
      if (currentInsurance.includes(insuranceId)) {
        return { ...prev, insurance: currentInsurance.filter(id => id !== insuranceId) };
      } else {
        return { ...prev, insurance: [...currentInsurance, insuranceId] };
      }
    });
  };

  // Apply filters
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange(filters);
      
      toast({
        title: "Filters Applied",
        description: "The map results have been updated based on your filters.",
      });
    }
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      type: "any",
      specialty: "any",
      priceRange: "any",
      radius: 5000,
      insurance: [],
      minRating: 0
    };
    
    setFilters(defaultFilters);
    
    if (onFilterChange) {
      onFilterChange(defaultFilters);
      
      toast({
        title: "Filters Reset",
        description: "All filters have been reset to default values.",
      });
    }
  };

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filter Results
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="text-xs"
          >
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Provider Type filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Provider Type</Label>
          <Select 
            value={filters.type} 
            onValueChange={(value) => handleFilterChange('type', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select provider type" />
            </SelectTrigger>
            <SelectContent>
              {PROVIDER_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Specialty filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Specialty</Label>
          <Select 
            value={filters.specialty} 
            onValueChange={(value) => handleFilterChange('specialty', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              {SPECIALTIES.map(specialty => (
                <SelectItem key={specialty.value} value={specialty.value}>
                  {specialty.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Distance filter */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-sm font-medium">Search Radius</Label>
            <span className="text-sm text-muted-foreground">{formatDistance(filters.radius)}</span>
          </div>
          <Slider 
            value={[filters.radius]} 
            min={1000} 
            max={20000} 
            step={1000} 
            onValueChange={(value) => handleFilterChange('radius', value[0])} 
          />
        </div>

        {/* Price range filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Price Range</Label>
          <Select 
            value={filters.priceRange} 
            onValueChange={(value) => handleFilterChange('priceRange', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_RANGES.map(price => (
                <SelectItem key={price.value} value={price.value}>
                  {price.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Insurance filter */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="insurance">
            <AccordionTrigger className="text-sm font-medium py-2">Insurance Accepted</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {INSURANCE_OPTIONS.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`insurance-${option.id}`} 
                      checked={filters.insurance.includes(option.id)}
                      onCheckedChange={() => toggleInsurance(option.id)}
                    />
                    <Label htmlFor={`insurance-${option.id}`}>
                      {option.label}
                    </Label>
                  </div>
                ))}
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
                  <Checkbox 
                    id="rating-5" 
                    checked={filters.minRating === 5}
                    onCheckedChange={(checked) => checked && handleFilterChange('minRating', 5)}
                  />
                  <Label htmlFor="rating-5" className="flex items-center">
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rating-4" 
                    checked={filters.minRating === 4}
                    onCheckedChange={(checked) => checked && handleFilterChange('minRating', 4)}
                  />
                  <Label htmlFor="rating-4" className="flex items-center">
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rating-3"
                    checked={filters.minRating === 3}
                    onCheckedChange={(checked) => checked && handleFilterChange('minRating', 3)}
                  />
                  <Label htmlFor="rating-3" className="flex items-center">
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rating-2" 
                    checked={filters.minRating === 2}
                    onCheckedChange={(checked) => checked && handleFilterChange('minRating', 2)}
                  />
                  <Label htmlFor="rating-2" className="flex items-center">
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rating-0" 
                    checked={filters.minRating === 0}
                    onCheckedChange={(checked) => checked && handleFilterChange('minRating', 0)}
                  />
                  <Label htmlFor="rating-0">Any Rating</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Apply filters button */}
        <Button className="w-full" onClick={applyFilters}>
          Apply Filters <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
