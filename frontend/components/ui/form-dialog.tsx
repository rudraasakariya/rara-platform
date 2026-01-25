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

export interface FormDialogProps {
  /** Controls dialog visibility */
  open: boolean
  /** Callback for state changes */
  onOpenChange: (open: boolean) => void
  /** Dialog title */
  title: string
  /** Optional description */
  description?: string
  /** Form content */
  children: React.ReactNode
  /** Submit handler */
  onSubmit: () => void | Promise<void>
  /** Cancel handler */
  onCancel: () => void
  /** Loading state */
  isLoading?: boolean
  /** Custom submit button text (default: "Save") */
  submitLabel?: string
  /** Custom cancel button text (default: "Cancel") */
  cancelLabel?: string
  /** Additional className for SheetContent */
  className?: string
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  className,
}: FormDialogProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit()
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

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className={cn("sm:max-w-lg", className)}>
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          <div className="mt-6 space-y-4">{children}</div>
          <SheetFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
