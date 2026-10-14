"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast, useToast } from "@/hooks/use-toast";
import { toastStyle } from "@/lib/utils";
import { api, type RouterOutputs } from "@/trpc/react";
import { SETTINGS_BUTTON_PRESS_CLASS } from "./press-feedback";

type SettingsData = RouterOutputs["user"]["getSettings"]["data"];

const emailSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
});

export function EmailSettingsCard({ initial }: { initial: SettingsData }) {
  const router = useRouter();
  const { dismiss } = useToast();
  const mutation = api.user.updateEmail.useMutation();

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: initial.email ?? "" },
  });

  // Provider sign-ins never set a password: the email is the OAuth identity
  // and stays fixed until a credential password is added below.
  const canChangeEmail = initial.hasPassword;

  const onSubmit = (values: z.infer<typeof emailSchema>) => {
    mutation.mutate(values, {
      onSuccess: () => {
        dismiss();
        toast({
          description: "Email changed — please verify the new address.",
          className: toastStyle,
        });
        router.refresh();
      },
      onError: (error) => {
        dismiss();
        toast({
          description: error.message || "Could not change email.",
          className: toastStyle,
        });
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Email</CardTitle>
          {initial.emailVerified ? (
            <Badge variant="secondary">Verified</Badge>
          ) : (
            <Badge variant="outline">Unverified</Badge>
          )}
        </div>
        <CardDescription>
          {canChangeEmail
            ? "Changing it signs you out of the old address and resets verification."
            : "Your sign-in address is managed by your provider."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {canChangeEmail ? (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet disabled={mutation.isPending}>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="settings-email">
                        Email address
                      </FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        autoComplete="email"
                        id="settings-email"
                        inputMode="email"
                        placeholder="you@example.com"
                        type="email"
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          We will ask you to verify the new address before it
                          takes effect.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <div>
                  <Button
                    className={SETTINGS_BUTTON_PRESS_CLASS}
                    disabled={mutation.isPending}
                    type="submit"
                  >
                    {mutation.isPending ? "Changing…" : "Change email"}
                  </Button>
                </div>
              </FieldGroup>
            </FieldSet>
          </form>
        ) : (
          <Alert>
            <ShieldAlert />
            <AlertTitle>Locked to your provider</AlertTitle>
            <AlertDescription>
              You signed in with a provider, so no credential password exists
              yet. Set a password below first — then this address becomes
              changeable.
              <span className="mt-2 flex items-center gap-1.5 font-medium">
                <KeyRound aria-hidden="true" className="size-3.5" />
                Current: {initial.email ?? "no address on file"}
              </span>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
