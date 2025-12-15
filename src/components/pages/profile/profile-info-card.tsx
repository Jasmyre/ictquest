"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useEffect } from "react";
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
import { api } from "@/trpc/react";
import { ProfileInfoCardLoading } from "./profile-info-card-loading";

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

export const ProfileInfoCard = () => {
  const user = api.user.getUser.useQuery();

  const form = useForm<z.infer<typeof profileInfoCardSchema>>({
    resolver: zodResolver(profileInfoCardSchema),
    defaultValues: {
      userName: user.data?.name ?? "Unknown name",
      email: user.data?.email ?? "Unknown email",
    },
  });

  useEffect(() => {
    if (user.data) {
      form.reset({
        userName: user.data.name ?? "Unknown name",
        email: user.data.email ?? "Unknown email",
      });
    }
  }, [user.data, form]);

  const handleSubmit = (values: z.infer<typeof profileInfoCardSchema>) => {
    console.log(values);
  };

  if (user.isLoading) {
    return <ProfileInfoCardLoading />;
  }

  return (
    <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between font-semibold text-2xl text-gray-900 dark:text-gray-100">
          <div className="flex min-w-min flex-wrap gap-2">
            <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
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
              <div className="flex justify-end">
                <Button
                  className="cursor-pointer border border-border bg-muted text-foreground"
                  type="submit"
                  variant={"ghost"}
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
