"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface DeleteDialogProps {
  /** Controls dialog visibility */
  open: boolean
  /** Callback for state changes */
  onOpenChange: (open: boolean) => void
  /** Dialog title (e.g., "Delete Site") */
  title: string
  /** Confirmation message (e.g., "Are you sure you want to delete {name}?") */
  description: string
  /** Name of item being deleted (for display) */
  itemName?: string
  /** Confirm handler */
  onConfirm: () => void | Promise<void>
  /** Cancel handler */
  onCancel: () => void
  /** Loading state */
  isLoading?: boolean
  /** Custom confirm button text (default: "Delete") */
  confirmLabel?: string
  /** Custom cancel button text (default: "Cancel") */
  cancelLabel?: string
  /** Additional className for SheetContent */
  className?: string
}

export function DeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  itemName,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  className,
}: DeleteDialogProps) {
  const handleConfirm = async () => {
    await onConfirm()
  }

  const handleCancel = () => {
    if (!isLoading) {
      onCancel()
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen)
    }
  }

  // Format description with item name if provided
  const formattedDescription = itemName
    ? description.replace(/{name}/g, itemName)
    : description

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className={cn("sm:max-w-lg", className)}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{formattedDescription}</SheetDescription>
        </SheetHeader>
        <SheetFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
