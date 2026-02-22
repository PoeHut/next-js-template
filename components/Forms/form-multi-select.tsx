"use client"

import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { ChevronDownIcon } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type MultiSelectOption = {
  label: string
  value: string
  disabled?: boolean
}

type FormMultiSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>
  name: TName
  label?: string
  description?: string
  placeholder?: string
  options: MultiSelectOption[]
  disabled?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
  maxPreviewItems?: number
}

function FormMultiSelectField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "Select one or more options",
  options,
  disabled,
  className,
  triggerClassName,
  contentClassName,
  maxPreviewItems = 2,
}: FormMultiSelectProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues = Array.isArray(field.value)
          ? (field.value as string[])
          : []

        const selectedLabels = options
          .filter((option) => selectedValues.includes(option.value))
          .map((option) => option.label)

        const triggerText =
          selectedLabels.length === 0
            ? placeholder
            : selectedLabels.length <= maxPreviewItems
              ? selectedLabels.join(", ")
              : `${selectedLabels.length} selected`

        return (
          <FormItem className={className}>
            {label ? <FormLabel>{label}</FormLabel> : null}
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <button
                    type="button"
                    disabled={disabled}
                    className={cn(
                      "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                      selectedLabels.length === 0 && "text-muted-foreground",
                      triggerClassName
                    )}
                  >
                    <span className="line-clamp-1 text-left">{triggerText}</span>
                    <ChevronDownIcon className="text-muted-foreground size-4 shrink-0 opacity-50" />
                  </button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className={cn("w-(--radix-popover-trigger-width) p-3", contentClassName)}
              >
                <div className="space-y-2">
                  {options.map((option) => {
                    const checkboxId = `${String(name)}-${option.value}`
                    const isChecked = selectedValues.includes(option.value)

                    return (
                      <div key={option.value} className="flex items-center gap-2">
                        <Checkbox
                          id={checkboxId}
                          checked={isChecked}
                          disabled={disabled || option.disabled}
                          onCheckedChange={(checked) => {
                            if (checked === true) {
                              field.onChange([...selectedValues, option.value])
                              return
                            }

                            field.onChange(
                              selectedValues.filter((value) => value !== option.value)
                            )
                          }}
                        />
                        <Label htmlFor={checkboxId}>{option.label}</Label>
                      </div>
                    )
                  })}
                </div>
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

export { FormMultiSelectField }
export type { FormMultiSelectProps, MultiSelectOption }
