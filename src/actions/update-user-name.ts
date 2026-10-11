"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { updateOwnProfile } from "@/server/services/user-profile";

export const updateUserName = async (name: string): Promise<void> => {
  const session = await auth();
  if (!session) {
    return;
  }

  const id = session.user.id;
  if (!id) {
    return;
  }

  // Legacy direct-update path rerouted through the profile service
  // (spec #81): all writes share the normalization seam instead of
  // touching Prisma from the action. Prefer the `user.updateProfile`
  // Procedure for new call sites.
  await updateOwnProfile(db, id, { userName: name });

  revalidatePath("/profile");
};
