"use client"

import { useState } from "react"
import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type DateRangeValue = {
  from?: string
  to?: string
}

type FormDateRangePickerProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>
  name: TName
  label?: string
  description?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
}

function parseDateFromValue(value: unknown): Date | undefined {
  if (typeof value !== "string" || value.length === 0) {
    return undefined
  }

  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) {
    return undefined
  }

  return new Date(year, month - 1, day)
}

function parseDateRangeFromValue(value: unknown): DateRange | undefined {
  if (!value || typeof value !== "object") {
    return undefined
  }

  const range = value as DateRangeValue

  return {
    from: parseDateFromValue(range.from),
    to: parseDateFromValue(range.to),
  }
}

function formatDateToValue(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

function formatDateRangeToValue(range: DateRange | undefined): DateRangeValue {
  return {
    from: range?.from ? formatDateToValue(range.from) : undefined,
    to: range?.to ? formatDateToValue(range.to) : undefined,
  }
}

function formatRangeLabel(range: DateRange | undefined, placeholder: string): string {
  if (!range?.from) {
    return placeholder
  }

  const fromText = range.from.toLocaleDateString()
  if (!range.to) {
    return `${fromText} - ...`
  }

  return `${fromText} - ${range.to.toLocaleDateString()}`
}

function FormDateRangePickerField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "Pick a date range",
  disabled,
  className,
  triggerClassName,
  contentClassName,
}: FormDateRangePickerProps<TFieldValues, TName>) {
  const [open, setOpen] = useState(false)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedRange = parseDateRangeFromValue(field.value)

        return (
          <FormItem className={className}>
            {label ? <FormLabel>{label}</FormLabel> : null}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedRange?.from && "text-muted-foreground",
                      triggerClassName
                    )}
                  >
                    {formatRangeLabel(selectedRange, placeholder)}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className={cn("w-auto overflow-hidden p-0", contentClassName)}
              >
                <Calendar
                  mode="range"
                  selected={selectedRange}
                  defaultMonth={selectedRange?.from}
                  captionLayout="dropdown"
                  onSelect={(range) => {
                    field.onChange(formatDateRangeToValue(range))

                    if (
                      range?.from &&
                      range?.to &&
                      range.to.getTime() !== range.from.getTime()
                    ) {
                      setOpen(false)
                    }
                  }}
                  disabled={disabled}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            {description ? <FormDescription>{description}</FormDescription> : null}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export { FormDateRangePickerField }
export type { DateRangeValue, FormDateRangePickerProps }
