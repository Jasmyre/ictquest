"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { type JSX, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { login } from "@/actions/Login";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LogInSchema } from "../schemas";
import { FormError } from "./FormError";
import { FormSuccess } from "./FormSuccess";

export const LogInForm = (): JSX.Element => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const form = useForm<z.infer<typeof LogInSchema>>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LogInSchema>): void => {
    setSuccess("");
    setError("");

    startTransition(async () => {
      await login(values).then((data) => {
        setSuccess(data?.success);
        setError(data?.error);
      });
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input
                {...field}
                className="mt-1 border-gray-400 dark:border-gray-600"
                id="email"
                placeholder="johndoe@example.com"
                type="email"
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <Input
                {...field}
                className="mt-1 border-gray-400 dark:border-gray-600"
                id="password"
                placeholder="******"
                type="password"
              />
            </FormItem>
          )}
        />
        <FormError message={error ?? urlError} />
        <FormSuccess message={success} />
        <Button
          className="w-full bg-indigo-500 hover:bg-indigo-400"
          disabled={isPending}
          type="submit"
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
};
