"use client";

import { register } from "@/actions/Register";
import { registerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import { Form, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { FormSuccess } from "./FormSuccess";
import { FormError } from "./FormError";

export const SignupForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    setSuccess("");
    setError("");
    
    startTransition(() => {
      register(values).then((data) => {

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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <Input
                {...field}
                id="name"
                type="text"
                className="mt-1 border-gray-400 dark:border-gray-600"
                placeholder="Johnny Bravo"
              />
            </FormItem>
          )}
        />

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
        <FormError message={error}  />
        <FormSuccess message={success} />
        <Button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-400"
          disabled={isPending}
        >
          Sign Up
        </Button>
      </form>
    </Form>
  );
};
