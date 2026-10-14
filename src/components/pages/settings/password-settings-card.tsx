"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

type SettingsData = RouterOutputs["user"]["getSettings"]["data"];

// Strength reuses the auth credential rule (`registerSchema` password:
// min 6) so settings never accepts a weaker secret than sign-up.
const authPasswordField = z
  .string()
  .min(6, "Password must be at least 6 characters.");

const changeSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: authPasswordField,
});

const setSchema = z.object({ newPassword: authPasswordField });

const PRESS =
  "cursor-pointer transition-transform duration-150 ease-out active:scale-[0.97]";

export function PasswordSettingsCard({ initial }: { initial: SettingsData }) {
  const router = useRouter();

  if (!initial.hasPassword) {
    return <SetPasswordCard onDone={() => router.refresh()} />;
  }

  return <ChangePasswordCard />;
}

function ChangePasswordCard() {
  const { dismiss } = useToast();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const updateMutation = api.user.updatePassword.useMutation();
  const pending = updateMutation.isPending;

  const form = useForm<z.infer<typeof changeSchema>>({
    resolver: zodResolver(changeSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const onSubmit = (values: z.infer<typeof changeSchema>) => {
    updateMutation.mutate(values, {
      onSuccess: () => {
        dismiss();
        toast({ description: "Password changed", className: toastStyle });
        form.reset();
      },
      onError: (error) => {
        dismiss();
        if (
          error.data?.code === "UNAUTHORIZED" ||
          error.message.toLowerCase().includes("current password")
        ) {
          form.setError("currentPassword", {
            message: "Current password is incorrect.",
          });
        }
        toast({
          description: error.message || "Could not change password.",
          className: toastStyle,
        });
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <KeyRound aria-hidden="true" className="size-4 text-primary" />
          Password
        </CardTitle>
        <CardDescription>
          Prove the current one to pick a new one. At least 6 characters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet disabled={pending}>
            <FieldGroup>
              <Controller
                control={form.control}
                name="currentPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between gap-2">
                      <FieldLabel htmlFor="settings-current-password">
                        Current password
                      </FieldLabel>
                      <button
                        className="cursor-pointer text-muted-foreground text-xs underline-offset-4 hover:underline"
                        onClick={() => setShowCurrent((value) => !value)}
                        type="button"
                      >
                        {showCurrent ? "Hide" : "Show"}
                      </button>
                    </div>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="current-password"
                      id="settings-current-password"
                      type={showCurrent ? "text" : "password"}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between gap-2">
                      <FieldLabel htmlFor="settings-new-password">
                        New password
                      </FieldLabel>
                      <button
                        className="cursor-pointer text-muted-foreground text-xs underline-offset-4 hover:underline"
                        onClick={() => setShowNew((value) => !value)}
                        type="button"
                      >
                        {showNew ? "Hide" : "Show"}
                      </button>
                    </div>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="new-password"
                      id="settings-new-password"
                      type={showNew ? "text" : "password"}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      <FieldDescription>
                        Same strength rule as sign-up: 6+ characters.
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
              <div>
                <Button className={PRESS} disabled={pending} type="submit">
                  {pending ? "Changing…" : "Change password"}
                </Button>
              </div>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}

function SetPasswordCard({ onDone }: { onDone: () => void }) {
  const { dismiss } = useToast();
  const setMutation = api.user.setPassword.useMutation();

  const form = useForm<z.infer<typeof setSchema>>({
    resolver: zodResolver(setSchema),
    defaultValues: { newPassword: "" },
  });

  const onSubmit = (values: z.infer<typeof setSchema>) => {
    setMutation.mutate(values, {
      onSuccess: () => {
        dismiss();
        toast({
          description: "Password set — you can now sign in with email too.",
          className: toastStyle,
        });
        form.reset();
        onDone();
      },
      onError: (error) => {
        dismiss();
        toast({
          description: error.message || "Could not set password.",
          className: toastStyle,
        });
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <KeyRound aria-hidden="true" className="size-4 text-primary" />
          Password
        </CardTitle>
        <CardDescription>
          No password on this account yet — set one to unlock credential sign-in
          and email changes.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Alert>
          <AlertTitle>Provider account</AlertTitle>
          <AlertDescription>
            No current-password check needed: there is nothing to prove yet.
          </AlertDescription>
        </Alert>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet disabled={setMutation.isPending}>
            <FieldGroup>
              <Controller
                control={form.control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="settings-set-password">
                      New password
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="new-password"
                      id="settings-set-password"
                      type="password"
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      <FieldDescription>
                        Same strength rule as sign-up: 6+ characters.
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
              <div>
                <Button
                  className={PRESS}
                  disabled={setMutation.isPending}
                  type="submit"
                >
                  {setMutation.isPending ? "Setting…" : "Set password"}
                </Button>
              </div>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
