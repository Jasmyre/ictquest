import { z } from "zod";

/**
 * Dashboard contracts (Slice 5, #62; public profile read in #91).
 *
 * Derived summary view over visible progress state. Shapes are
 * field-identical to the prior progress `stats` shapes plus the approved
 * additions: redacted public biography, `isPrivate` flag, and the unlocked
 * achievement inventory. Strict objects: unknown fields fail loudly, never
 * strip-drift. `unlockedAt` is pinned to the REST wire shape (ISO datetime)
 * and is already serialized at the business tier, so the contract holds on
 * the typed tRPC transport too.
 */

export const dashboardByIdSchema = z.strictObject({
  id: z.string().min(1),
});

export type DashboardByIdInput = z.infer<typeof dashboardByIdSchema>;

export const dashboardAchievementSchema = z.strictObject({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  unlockedAt: z.iso.datetime(),
});

export const dashboardDataSchema = z.strictObject({
  userName: z.string().nullable(),
  id: z.string(),
  image: z.string().nullable(),
  biography: z.string().nullable(),
  isPrivate: z.boolean(),
  totalAchievements: z.number(),
  totalSubtopicsCompleted: z.number(),
  level: z.string(),
  totalProgress: z.number(),
  progressData: z.array(
    z.strictObject({
      topic: z.string(),
      subtopics: z.array(z.string()),
    })
  ),
  achievements: z.array(dashboardAchievementSchema),
});

export const dashboardOutputSchema = z.strictObject({
  success: z.literal(true),
  data: dashboardDataSchema,
});

export type DashboardData = z.infer<typeof dashboardDataSchema>;
export type DashboardOutput = z.infer<typeof dashboardOutputSchema>;
