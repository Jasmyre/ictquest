"use client";

import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { LogInSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/actions/Login";

import { type JSX, useState, useTransition } from "react";
import type * as z from "zod";

import { FormError } from "./FormError";
import { FormSuccess } from "./FormSuccess";
import { useSearchParams } from "next/navigation";

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
                id="email"
                type="email"
                className="mt-1 border-gray-400 dark:border-gray-600"
                placeholder="johndoe@example.com"
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
                id="password"
                type="password"
                className="mt-1 border-gray-400 dark:border-gray-600"
                placeholder="******"
              />
            </FormItem>
          )}
        />
        <FormError message={error ?? urlError} />
        <FormSuccess message={success} />
        <Button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-400"
          disabled={isPending}
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
};
