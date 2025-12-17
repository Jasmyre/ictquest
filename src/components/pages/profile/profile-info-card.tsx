"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User as UserIcon } from "lucide-react";
import type { Session } from "next-auth";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const profileInfoCardSchema = z.object({
  userName: z
    .string({ error: "User name is required." })
    .min(1, { error: "User name must be at least 1 characters long" })
    .max(32, { error: "User name must not exceed 32 characters length." }),

  email: z
    .string({ error: "Email is required." })
    .min(1, { error: "Email must be at least 3 characters long." })
    .max(32, "Email must not exceed 32 characters length.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address."),
});

export const ProfileInfoCard = ({ user }: { user: Session["user"] }) => {
  const form = useForm<z.infer<typeof profileInfoCardSchema>>({
    resolver: zodResolver(profileInfoCardSchema),
    defaultValues: {
      userName: user.name ?? "Unknown name",
      email: user.email ?? "Unknown email",
    },
  });

  const handleSubmit = (values: z.infer<typeof profileInfoCardSchema>) => {
    console.log(values);
  };

  return (
    <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between font-semibold text-2xl text-gray-900 dark:text-gray-100">
          <div className="flex min-w-min flex-wrap gap-2">
            <UserIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <p>Personal Information</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldSet>
            <FieldGroup>
              {/* User name */}
              <Controller
                control={form.control}
                name="userName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={"user-name"}>Username</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      className="bg-muted"
                      id="user-name"
                      placeholder="Enter user name."
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              {/* Email */}
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={"email"}>email</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      className="bg-muted"
                      disabled
                      id="email"
                      placeholder="Enter email."
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
              <div>
                <Button
                  className="cursor-pointer max-sm:w-full"
                  type="submit"
                  variant={"card-button"}
                >
                  Submit
                </Button>
              </div>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
};
