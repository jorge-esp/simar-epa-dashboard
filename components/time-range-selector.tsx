"use client"

import { Button } from "@/components/ui/button"

export type TimeRange = "12h" | "24h" | "48h" | "7d"

interface TimeRangeSelectorProps {
  value: TimeRange
  onChange: (range: TimeRange) => void
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  const ranges: { value: TimeRange; label: string }[] = [
    { value: "12h", label: "12h" },
    { value: "24h", label: "24h" },
    { value: "48h", label: "48h" },
    { value: "7d", label: "7d" },
  ]

  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant={value === range.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(range.value)}
          className={`h-8 px-3 text-xs font-medium transition-all ${
            value === range.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {range.label}
        </Button>
      ))}
    </div>
  )
}
