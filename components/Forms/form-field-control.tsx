"use client"

import type { FieldPath, FieldValues } from "react-hook-form"

import { FormCheckboxField, type FormCheckboxProps } from "./form-checkbox"
import {
  FormDateRangePickerField,
  type FormDateRangePickerProps,
} from "./form-date-range-picker"
import {
  FormDatePickerField,
  type FormDatePickerProps,
} from "./form-date-picker"
import { FormInputField, type FormInputProps } from "./form-input"
import {
  FormMultiSelectField,
  type FormMultiSelectProps,
} from "./form-multi-select"
import {
  FormRadioGroupField,
  type FormRadioGroupProps,
} from "./form-radio-group"
import { FormSelectField, type FormSelectProps } from "./form-select"
import { FormTextareaField, type FormTextareaProps } from "./form-textarea"
import { FormTimePickerField, type FormTimePickerProps } from "./form-time-picker"

type FormFieldControlProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> =
  | ({ fieldType: "input" } & FormInputProps<TFieldValues, TName>)
  | ({ fieldType: "textarea" } & FormTextareaProps<TFieldValues, TName>)
  | ({ fieldType: "checkbox" } & FormCheckboxProps<TFieldValues, TName>)
  | ({ fieldType: "radio" } & FormRadioGroupProps<TFieldValues, TName>)
  | ({ fieldType: "select" } & FormSelectProps<TFieldValues, TName>)
  | ({ fieldType: "multi-select" } & FormMultiSelectProps<TFieldValues, TName>)
  | ({ fieldType: "date-range-picker" } & FormDateRangePickerProps<TFieldValues, TName>)
  | ({ fieldType: "date-picker" } & FormDatePickerProps<TFieldValues, TName>)
  | ({ fieldType: "time-picker" } & FormTimePickerProps<TFieldValues, TName>)

function FormFieldControl<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: FormFieldControlProps<TFieldValues, TName>) {
  if (props.fieldType === "input") {
    const { fieldType, ...fieldProps } = props
    return <FormInputField<TFieldValues, TName> {...fieldProps} />
  }

  if (props.fieldType === "textarea") {
    const { fieldType, ...fieldProps } = props
    return <FormTextareaField<TFieldValues, TName> {...fieldProps} />
  }

  if (props.fieldType === "checkbox") {
    const { fieldType, ...fieldProps } = props
    return <FormCheckboxField<TFieldValues, TName> {...fieldProps} />
  }

  if (props.fieldType === "radio") {
    const { fieldType, ...fieldProps } = props
    return <FormRadioGroupField<TFieldValues, TName> {...fieldProps} />
  }

  if (props.fieldType === "multi-select") {
    const { fieldType, ...fieldProps } = props
    return <FormMultiSelectField<TFieldValues, TName> {...fieldProps} />
  }

  if (props.fieldType === "date-picker") {
    const { fieldType, ...fieldProps } = props
    return <FormDatePickerField<TFieldValues, TName> {...fieldProps} />
  }

  if (props.fieldType === "date-range-picker") {
    const { fieldType, ...fieldProps } = props
    return <FormDateRangePickerField<TFieldValues, TName> {...fieldProps} />
  }

  if (props.fieldType === "time-picker") {
    const { fieldType, ...fieldProps } = props
    return <FormTimePickerField<TFieldValues, TName> {...fieldProps} />
  }

  const { fieldType, ...fieldProps } = props
  return <FormSelectField<TFieldValues, TName> {...fieldProps} />
}

export { FormFieldControl }
export type { FormFieldControlProps }
