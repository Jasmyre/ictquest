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
import {
  BIOGRAPHY_MAX_LENGTH,
  USER_NAME_MAX_LENGTH,
} from "@/server/services/user-profile";
import { api } from "@/trpc/react";

const profileFormSchema = z.object({
  name: z
    .string({ error: "Display name is required." })
    .min(1, { error: "Display name must not be empty." })
    .max(100, { error: "Display name must be at most 100 characters." }),
  userName: z
    .string()
    .max(USER_NAME_MAX_LENGTH, {
      error: `User name must be at most ${USER_NAME_MAX_LENGTH} characters.`,
    })
    .nullable(),
  biography: z
    .string()
    .max(BIOGRAPHY_MAX_LENGTH, {
      error: `Biography must be at most ${BIOGRAPHY_MAX_LENGTH} characters.`,
    })
    .nullable(),
  isPrivate: z.boolean(),
});

export type SettingsProfile = {
  id: string;
  name: string;
  userName: string | null;
  biography: string | null;
  isPrivate: boolean;
};

export function ProfileForm({ profile }: { profile: SettingsProfile }) {
  const router = useRouter();
  const utils = api.useUtils();
  const updateProfile = api.user.updateProfile.useMutation();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile.name,
      userName: profile.userName ?? "",
      biography: profile.biography ?? "",
      isPrivate: profile.isPrivate,
    },
  });

  const biographyValue = form.watch("biography") ?? "";
  const biographyCount = biographyValue.length;

  const handleSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      await updateProfile.mutateAsync({
        name: values.name,
        userName: values.userName === "" ? null : values.userName,
        biography: values.biography === "" ? null : values.biography,
        isPrivate: values.isPrivate,
      });
      await utils.user.getProfile.invalidate();
      router.refresh();
      toast({
        description: "Profile updated successfully",
        className: toastStyle,
      });
    } catch (error: unknown) {
      toast({
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again later.",
        className: toastStyle,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profile</CardTitle>
        <CardDescription>
          How your name, handle, biography, and privacy appear to others.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldSet>
            <FieldGroup>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="settings-display-name">
                      Display name
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      className="bg-muted"
                      id="settings-display-name"
                      placeholder="Enter your display name."
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="userName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="settings-handle">Handle</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      className="bg-muted"
                      id="settings-handle"
                      placeholder="Enter your handle."
                      value={field.value ?? ""}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="biography"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-baseline justify-between gap-2">
                      <FieldLabel htmlFor="settings-biography">
                        Biography
                      </FieldLabel>
                      <span
                        aria-live="polite"
                        className="text-muted-foreground text-xs tabular-nums"
                      >
                        {biographyCount}/{BIOGRAPHY_MAX_LENGTH}
                      </span>
                    </div>
                    <textarea
                      aria-invalid={fieldState.invalid}
                      className="min-h-24 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                      id="settings-biography"
                      maxLength={BIOGRAPHY_MAX_LENGTH + 1}
                      onBlur={field.onBlur}
                      onChange={(event) =>
                        field.onChange(event.target.value || null)
                      }
                      placeholder="Tell others about yourself."
                      ref={field.ref}
                      value={field.value ?? ""}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <input
                      checked={field.value}
                      className="h-4 w-4 shrink-0 cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      id="settings-private"
                      onBlur={field.onBlur}
                      onChange={(event) => field.onChange(event.target.checked)}
                      ref={field.ref}
                      type="checkbox"
                    />
                    <FieldLabel
                      className="cursor-pointer font-normal"
                      htmlFor="settings-private"
                    >
                      Private profile (hide my biography from others)
                    </FieldLabel>
                  </Field>
                )}
              />

              <div>
                <Button
                  className="w-full transition-transform duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none sm:w-fit"
                  disabled={updateProfile.isPending}
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
}
