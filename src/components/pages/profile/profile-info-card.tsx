"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User as UserIcon } from "lucide-react";
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
import type { api } from "@/trpc/server";

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

export const ProfileInfoCard = ({
  getUser,
}: {
  getUser: Awaited<ReturnType<typeof api.user.getUser>>;
}) => {
  const user = getUser.data;

  const form = useForm<z.infer<typeof profileInfoCardSchema>>({
    resolver: zodResolver(profileInfoCardSchema),
    defaultValues: {
      userName: user?.name ?? "Unknown name",
      email: user?.email ?? "Unknown email",
    },
  });

  const handleSubmit = (values: z.infer<typeof profileInfoCardSchema>) => {
    console.log(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserIcon className="h-5 w-5 text-primary" />
          Personal information
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
                  className="w-full transition-transform duration-150 ease-out active:scale-[0.97] sm:w-fit"
                  type="submit"
                >
                  Save changes
                </Button>
              </div>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
};
