
import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: boolean
  trueLabel: string
  falseLabel: string
  variant?: 'default' | 'success' | 'warning' | 'destructive'
}

export function StatusBadge({ status, trueLabel, falseLabel, variant = 'default' }: StatusBadgeProps) {
  if (status) {
    return (
      <Badge 
        variant={variant === 'success' ? 'default' : variant}
        className={cn(
          "text-xs font-medium",
          variant === 'success' && "bg-green-100 text-green-800 border-green-300",
          variant === 'warning' && "bg-amber-100 text-amber-800 border-amber-300",
          variant === 'destructive' && "bg-red-100 text-red-800 border-red-300"
        )}
      >
        {trueLabel}
      </Badge>
    )
  }
  
  return (
    <Badge variant="outline" className="text-xs font-medium bg-gray-50 text-gray-500 border-gray-200">
      {falseLabel}
    </Badge>
  )
}
