"use client"

import * as React from "react"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"

export interface ColumnDef<T> {
  id: string
  header: string
  accessorKey?: keyof T
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
}

export interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onView?: (item: T) => void
  isLoading?: boolean
  emptyMessage?: string
  className?: string
  getRowId?: (item: T) => string | number
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
  emptyMessage = "No data available",
  className,
  getRowId,
}: DataTableProps<T>) {
  const getItemId = React.useCallback(
    (item: T, index: number): string | number => {
      if (getRowId) {
        return getRowId(item)
      }
      // Try to find common ID fields
      if ("id" in item && item.id != null) {
        return item.id
      }
      return index
    },
    [getRowId]
  )

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Loading skeleton */}
            <div className="space-y-3">
              {/* Header skeleton */}
              <div className="grid gap-4 border-b pb-4" style={{ gridTemplateColumns: `repeat(${columns.length + 1}, minmax(0, 1fr))` }}>
                {columns.map((col) => (
                  <div key={col.id} className="h-4 bg-muted rounded animate-pulse" />
                ))}
                <div className="h-4 w-12 bg-muted rounded animate-pulse" />
              </div>
              {/* Row skeletons */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="grid gap-4 py-3 border-b last:border-0"
                  style={{ gridTemplateColumns: `repeat(${columns.length + 1}, minmax(0, 1fr))` }}
                >
                  {columns.map((col) => (
                    <div key={col.id} className="h-4 bg-muted rounded animate-pulse" />
                  ))}
                  <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const hasActions = onEdit || onDelete || onView

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className="px-6 py-3 text-left text-sm font-medium text-muted-foreground"
                  >
                    {column.header}
                  </th>
                ))}
                {hasActions && (
                  <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground w-12">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const itemId = getItemId(item, index)
                return (
                  <tr
                    key={itemId}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    {columns.map((column) => {
                      let cellContent: React.ReactNode

                      if (column.cell) {
                        cellContent = column.cell(item)
                      } else if (column.accessorKey) {
                        const value = item[column.accessorKey]
                        cellContent =
                          value != null ? String(value) : <span className="text-muted-foreground">—</span>
                      } else {
                        cellContent = <span className="text-muted-foreground">—</span>
                      }

                      return (
                        <td key={column.id} className="px-6 py-4 text-sm">
                          {cellContent}
                        </td>
                      )
                    })}
                    {hasActions && (
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onView && (
                              <DropdownMenuItem onClick={() => onView(item)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            )}
                            {onEdit && (
                              <DropdownMenuItem onClick={() => onEdit(item)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {onDelete && (
                              <DropdownMenuItem
                                onClick={() => onDelete(item)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
