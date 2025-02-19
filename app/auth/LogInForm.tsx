"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogInSchema } from "@/schemas";
import { useForm } from "react-hook-form";

import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const LogInForm = () => {
  const form = useForm<z.infer<typeof LogInSchema>>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(() => {})}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email
              </FormLabel>
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
        {/* <FormError message={""}  /> */}
        {/* <FormSuccess message={""} /> */}
        <Button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-400"
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
};
