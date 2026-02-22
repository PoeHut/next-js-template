"use client"

import { useState } from "react"
import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { format } from "date-fns"

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

type FormDatePickerProps<
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

function formatDateToValue(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

function FormDatePickerField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "Pick a date",
  disabled,
  className,
  triggerClassName,
  contentClassName,
}: FormDatePickerProps<TFieldValues, TName>) {
  const [open, setOpen] = useState(false)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedDate = parseDateFromValue(field.value)

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
                      !selectedDate && "text-muted-foreground",
                      triggerClassName
                    )}
                  >
                    {selectedDate
                      ? selectedDate.toLocaleDateString()
                      : placeholder}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className={cn("w-auto overflow-hidden p-0", contentClassName)}
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  defaultMonth={selectedDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    field.onChange(date ? formatDateToValue(date) : "")
                    setOpen(false)
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

export { FormDatePickerField }
export type { FormDatePickerProps }
