"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export type FilterType = "text" | "select" | "boolean"

export interface FilterOption {
  label: string
  value: string | number | boolean
}

export interface FilterConfig {
  key: string
  label: string
  type: FilterType
  placeholder?: string
  options?: FilterOption[] // For select type
}

export interface FilterBarProps {
  filters: FilterConfig[]
  onFilterChange: (filters: Record<string, any>) => void
  onClear: () => void
  className?: string
}

export function FilterBar({
  filters,
  onFilterChange,
  onClear,
  className,
}: FilterBarProps) {
  const [filterValues, setFilterValues] = React.useState<Record<string, any>>({})

  const handleFilterChange = (key: string, value: any) => {
    const newValues = { ...filterValues, [key]: value }
    setFilterValues(newValues)
  }

  const handleApply = () => {
    // Remove empty values before passing to parent
    const cleanedValues = Object.fromEntries(
      Object.entries(filterValues).filter(([_, value]) => {
        if (value === null || value === undefined) return false
        if (typeof value === "string" && value.trim() === "") return false
        return true
      })
    )
    onFilterChange(cleanedValues)
  }

  const handleClear = () => {
    setFilterValues({})
    onClear()
  }

  const hasActiveFilters = Object.values(filterValues).some((value) => {
    if (value === null || value === undefined) return false
    if (typeof value === "string" && value.trim() === "") return false
    return true
  })

  const renderFilterInput = (filter: FilterConfig) => {
    const value = filterValues[filter.key] ?? ""

    switch (filter.type) {
      case "text":
        return (
          <Input
            type="text"
            placeholder={filter.placeholder || `Filter by ${filter.label.toLowerCase()}`}
            value={value}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full"
          />
        )

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => {
              const newValue = e.target.value === "" ? undefined : e.target.value
              handleFilterChange(filter.key, newValue)
            }}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <option value="">All</option>
            {filter.options?.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case "boolean":
        return (
          <select
            value={value === "" ? "" : String(value)}
            onChange={(e) => {
              const newValue = e.target.value === "" ? undefined : e.target.value === "true"
              handleFilterChange(filter.key, newValue)
            }}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        )

      default:
        return null
    }
  }

  return (
    <Card className={cn("mb-4", className)}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Filters</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 text-xs"
              >
                <X className="mr-1 h-3 w-3" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <Label htmlFor={filter.key}>{filter.label}</Label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClear} disabled={!hasActiveFilters}>
              Clear
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
