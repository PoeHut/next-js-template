"use client"

import type { Control, FieldPath, FieldValues } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type RadioOption = {
  label: string
  value: string
  disabled?: boolean
}

type FormRadioGroupProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>
  name: TName
  label?: string
  description?: string
  options: RadioOption[]
  disabled?: boolean
  className?: string
  groupClassName?: string
}

function FormRadioGroupField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  options,
  disabled,
  className,
  groupClassName,
}: FormRadioGroupProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <RadioGroup
              className={groupClassName}
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              {options.map((option) => {
                const radioId = `${String(name)}-${option.value}`

                return (
                  <div key={option.value} className="flex items-center gap-2">
                    <RadioGroupItem
                      id={radioId}
                      value={option.value}
                      disabled={option.disabled || disabled}
                    />
                    <Label htmlFor={radioId}>{option.label}</Label>
                  </div>
                )
              })}
            </RadioGroup>
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { FormRadioGroupField }
export type { FormRadioGroupProps, RadioOption }
