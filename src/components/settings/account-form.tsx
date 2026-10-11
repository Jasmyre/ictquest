"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { toastStyle } from "@/lib/utils";
import { api } from "@/trpc/react";

// Mirrors PASSWORD_MIN_LENGTH in `@/server/services/user-credentials`.
// The service module is server-only (bcrypt), so the client keeps its own
// copy for help text — strength itself is enforced server-side.
const PASSWORD_MIN_LENGTH = 8;

const emailFormSchema = z.object({
  email: z
    .string({ error: "Email is required." })
    .min(1, { error: "Email is required." })
    .max(254, { error: "Email must be at most 254 characters." }),
});

const changePasswordFormSchema = z.object({
  currentPassword: z
    .string({ error: "Current password is required." })
    .min(1, { error: "Current password is required." }),
  newPassword: z
    .string({ error: "New password is required." })
    .min(1, { error: "New password is required." })
    .max(128, { error: "New password must be at most 128 characters." }),
});

const setPasswordFormSchema = z.object({
  newPassword: z
    .string({ error: "New password is required." })
    .min(1, { error: "New password is required." })
    .max(128, { error: "New password must be at most 128 characters." }),
});

export type SettingsAccount = {
  id: string;
  email: string | null;
  emailVerified: Date | null;
  hasPassword: boolean;
};

function serverMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again later.";
}

export function AccountForm({ account }: { account: SettingsAccount }) {
  const router = useRouter();
  const utils = api.useUtils();
  const updateEmail = api.user.updateEmail.useMutation();
  const updatePassword = api.user.updatePassword.useMutation();
  const setPassword = api.user.setPassword.useMutation();

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: account.email ?? "" },
  });

  const changeForm = useForm<z.infer<typeof changePasswordFormSchema>>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const setForm = useForm<z.infer<typeof setPasswordFormSchema>>({
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: { newPassword: "" },
  });

  const handleEmailSubmit = async (values: z.infer<typeof emailFormSchema>) => {
    try {
      const result = await updateEmail.mutateAsync(values);
      await utils.user.getAccount.invalidate();
      router.refresh();
      toast({
        description: result.data.verificationRequired
          ? "Email updated — verify your new address before it takes effect."
          : "Email is already up to date.",
        className: toastStyle,
      });
    } catch (error: unknown) {
      emailForm.setError("email", { message: serverMessage(error) });
    }
  };

  const handleChangeSubmit = async (
    values: z.infer<typeof changePasswordFormSchema>
  ) => {
    try {
      await updatePassword.mutateAsync(values);
      changeForm.reset({ currentPassword: "", newPassword: "" });
      toast({ description: "Password changed.", className: toastStyle });
    } catch (error: unknown) {
      changeForm.setError("root", { message: serverMessage(error) });
    }
  };

  const handleSetSubmit = async (
    values: z.infer<typeof setPasswordFormSchema>
  ) => {
    try {
      await setPassword.mutateAsync(values);
      await utils.user.getAccount.invalidate();
      router.refresh();
      toast({ description: "Password set.", className: toastStyle });
    } catch (error: unknown) {
      setForm.setError("newPassword", { message: serverMessage(error) });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Email</CardTitle>
          <CardDescription>
            Change your sign-in email. A new address must verify before it takes
            effect.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-8"
            onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
          >
            <FieldSet>
              <FieldGroup>
                <Controller
                  control={emailForm.control}
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
                        className="bg-muted"
                        id="settings-email"
                        placeholder="you@example.com"
                        type="email"
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />
                <div>
                  <Button
                    className="w-full transition-transform duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none sm:w-fit"
                    disabled={updateEmail.isPending}
                    type="submit"
                  >
                    Save email
                  </Button>
                </div>
              </FieldGroup>
            </FieldSet>
          </form>
        </CardContent>
      </Card>

      {account.hasPassword ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Password</CardTitle>
            <CardDescription>
              Prove your current password, then pick a stronger one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-8"
              onSubmit={changeForm.handleSubmit(handleChangeSubmit)}
            >
              <FieldSet>
                <FieldGroup>
                  <Controller
                    control={changeForm.control}
                    name="currentPassword"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="settings-current-password">
                          Current password
                        </FieldLabel>
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          autoComplete="current-password"
                          className="bg-muted"
                          id="settings-current-password"
                          type="password"
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : null}
                      </Field>
                    )}
                  />
                  <Controller
                    control={changeForm.control}
                    name="newPassword"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="settings-new-password">
                          New password
                        </FieldLabel>
                        <Input
                          {...field}
                          aria-describedby="settings-new-password-help"
                          aria-invalid={fieldState.invalid}
                          autoComplete="new-password"
                          className="bg-muted"
                          id="settings-new-password"
                          type="password"
                        />
                        <p
                          className="text-muted-foreground text-xs"
                          id="settings-new-password-help"
                        >
                          At least {PASSWORD_MIN_LENGTH} characters with both a
                          letter and a number.
                        </p>
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : null}
                      </Field>
                    )}
                  />
                  {changeForm.formState.errors.root ? (
                    <p className="text-destructive text-sm" role="alert">
                      {changeForm.formState.errors.root.message}
                    </p>
                  ) : null}
                  <div>
                    <Button
                      className="w-full transition-transform duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none sm:w-fit"
                      disabled={updatePassword.isPending}
                      type="submit"
                    >
                      Change password
                    </Button>
                  </div>
                </FieldGroup>
              </FieldSet>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Set a password</CardTitle>
            <CardDescription>
              You signed in with an OAuth provider, so no password is set yet.
              Add one to enable credential sign-in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-8"
              onSubmit={setForm.handleSubmit(handleSetSubmit)}
            >
              <FieldSet>
                <FieldGroup>
                  <Controller
                    control={setForm.control}
                    name="newPassword"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="settings-set-password">
                          New password
                        </FieldLabel>
                        <Input
                          {...field}
                          aria-describedby="settings-set-password-help"
                          aria-invalid={fieldState.invalid}
                          autoComplete="new-password"
                          className="bg-muted"
                          id="settings-set-password"
                          type="password"
                        />
                        <p
                          className="text-muted-foreground text-xs"
                          id="settings-set-password-help"
                        >
                          At least {PASSWORD_MIN_LENGTH} characters with both a
                          letter and a number.
                        </p>
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : null}
                      </Field>
                    )}
                  />
                  <div>
                    <Button
                      className="w-full transition-transform duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none sm:w-fit"
                      disabled={setPassword.isPending}
                      type="submit"
                    >
                      Set password
                    </Button>
                  </div>
                </FieldGroup>
              </FieldSet>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
