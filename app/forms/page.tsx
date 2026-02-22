"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { FormFieldControl } from "@/components/Forms"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

const contactFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  contactMethod: z.enum(["email", "phone"]),
  country: z.string().min(1, "Please select a country"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  preferredDateRange: z
    .object({
      from: z.string().optional(),
      to: z.string().optional(),
    })
    .refine((value) => Boolean(value.from && value.to), {
      message: "Please select a date range",
    }),
  preferredDate: z.string().min(1, "Please select a date"),
  preferredTime: z.string().min(1, "Please select a time"),
  termsAccepted: z
    .boolean()
    .refine((value) => value, "You must accept the terms and conditions"),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

const contactMethodOptions = [
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
]

const countryOptions = [
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Singapore", value: "sg" },
  { label: "Japan", value: "jp" },
]

const skillsOptions = [
  { label: "React", value: "react" },
  { label: "TypeScript", value: "typescript" },
  { label: "Node.js", value: "nodejs" },
  { label: "UI Design", value: "ui-design" },
]

export default function FormsPage() {
  const [submittedData, setSubmittedData] = useState<ContactFormValues | null>(
    null
  )

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      bio: "",
      contactMethod: "email",
      country: "",
      skills: [],
      preferredDateRange: {
        from: undefined,
        to: undefined,
      },
      preferredDate: "",
      preferredTime: "",
      termsAccepted: false,
    },
  })

  function onSubmit(values: ContactFormValues) {
    setSubmittedData(values)
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reusable Form Demo</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          This page uses all reusable field types from{" "}
          <code>components/Forms</code>.
        </p>
      </div>

      <div className="bg-card rounded-xl border p-6">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <FormFieldControl
              fieldType="input"
              control={form.control}
              name="fullName"
              label="Full Name"
              placeholder="Ada Lovelace"
            />

            <FormFieldControl
              fieldType="input"
              control={form.control}
              name="email"
              label="Email"
              placeholder="ada@example.com"
              type="email"
            />

            <FormFieldControl
              fieldType="textarea"
              control={form.control}
              name="bio"
              label="Bio"
              placeholder="Tell us a bit about yourself"
            />

            <FormFieldControl
              fieldType="radio"
              control={form.control}
              name="contactMethod"
              label="Preferred Contact Method"
              options={contactMethodOptions}
            />

            <FormFieldControl
              fieldType="select"
              control={form.control}
              name="country"
              label="Country"
              placeholder="Choose your country"
              options={countryOptions}
            />

            <FormFieldControl
              fieldType="multi-select"
              control={form.control}
              name="skills"
              label="Skills"
              placeholder="Select your skills"
              options={skillsOptions}
            />

            <FormFieldControl
              fieldType="date-range-picker"
              control={form.control}
              name="preferredDateRange"
              label="Preferred Date Range"
              placeholder="Pick a date range"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormFieldControl
                fieldType="date-picker"
                control={form.control}
                name="preferredDate"
                label="Preferred Date"
              />

              <FormFieldControl
                fieldType="time-picker"
                control={form.control}
                name="preferredTime"
                label="Preferred Time"
              />
            </div>

            <FormFieldControl
              fieldType="checkbox"
              control={form.control}
              name="termsAccepted"
              label="I agree to the terms and conditions"
            />

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit">Submit</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset()
                  setSubmittedData(null)
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {submittedData ? (
        <div className="bg-card rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Submitted Values</h2>
          <pre className="bg-muted mt-3 overflow-x-auto rounded-md p-4 text-xs">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  )
}
