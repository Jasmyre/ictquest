"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast, useToast } from "@/hooks/use-toast";
import { toastStyle } from "@/lib/utils";
import {
  BIOGRAPHY_MAX_LENGTH,
  DISPLAY_NAME_MAX_LENGTH,
  DISPLAY_NAME_MIN_LENGTH,
} from "@/server/schemas/user";
import { api, type RouterOutputs } from "@/trpc/react";
import { SETTINGS_BUTTON_PRESS_CLASS } from "./press-feedback";

type SettingsData = RouterOutputs["user"]["getSettings"]["data"];

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(DISPLAY_NAME_MIN_LENGTH)
    .max(DISPLAY_NAME_MAX_LENGTH),
  biography: z.string().max(BIOGRAPHY_MAX_LENGTH).nullable().optional(),
  isPrivate: z.boolean(),
});

export function ProfileSettingsCard({ initial }: { initial: SettingsData }) {
  const router = useRouter();
  const { dismiss } = useToast();
  const [savedFlash, setSavedFlash] = useState(false);
  const mutation = api.user.updateSettings.useMutation();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initial.name ?? "",
      biography: initial.biography ?? "",
      isPrivate: initial.isPrivate ?? false,
    },
  });

  const biographyValue = form.watch("biography") ?? "";
  const remaining = BIOGRAPHY_MAX_LENGTH - (biographyValue?.length ?? 0);

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    const biography =
      values.biography === undefined || values.biography === null
        ? null
        : values.biography.trim().length === 0
          ? null
          : values.biography.trim();
    mutation.mutate(
      { ...values, biography },
      {
        onSuccess: () => {
          dismiss();
          toast({ description: "Profile saved", className: toastStyle });
          setSavedFlash(true);
          window.setTimeout(() => setSavedFlash(false), 1600);
          router.refresh();
        },
        onError: (error) => {
          dismiss();
          toast({
            description: error.message || "Could not save profile.",
            className: toastStyle,
          });
        },
      }
    );
  };

  const initials = (initial.name ?? "L")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="size-12">
            {initial.image ? (
              <AvatarImage
                alt={initial.name ?? "Profile photo"}
                src={initial.image}
              />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="text-lg">Profile</CardTitle>
            <CardDescription className="truncate">
              {savedFlash ? "Saved" : "Your public identity on ICTQuest."}
            </CardDescription>
          </div>
          {initial.isPrivate ? (
            <Badge className="ml-auto shrink-0" variant="secondary">
              Private
            </Badge>
          ) : (
            <Badge className="ml-auto shrink-0" variant="outline">
              Public
            </Badge>
          )}
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="settings-name">
                      Display name
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="settings-name"
                      placeholder="Ada Lovelace"
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      <FieldDescription>
                        Shown across lessons and leaderboards.
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="biography"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-baseline justify-between gap-2">
                      <FieldLabel htmlFor="settings-bio">Biography</FieldLabel>
                      <span
                        aria-live="polite"
                        className="text-muted-foreground text-xs tabular-nums"
                      >
                        {remaining} left
                      </span>
                    </div>
                    <Textarea
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="settings-bio"
                      maxLength={BIOGRAPHY_MAX_LENGTH}
                      placeholder="What should fellow learners know about you?"
                      rows={4}
                      value={field.value ?? ""}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      <FieldDescription>
                        Empty clears it. Others see it unless your profile is
                        private.
                      </FieldDescription>
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <div className="flex-1">
                      <FieldLabel htmlFor="settings-private">
                        Private profile
                      </FieldLabel>
                      <FieldDescription>
                        Hide your biography from other learners.
                      </FieldDescription>
                    </div>
                    <Switch
                      checked={field.value}
                      className="cursor-pointer"
                      id="settings-private"
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />
              <div>
                <Button
                  className={SETTINGS_BUTTON_PRESS_CLASS}
                  disabled={mutation.isPending}
                  type="submit"
                >
                  {mutation.isPending ? "Saving…" : "Save profile"}
                </Button>
              </div>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
