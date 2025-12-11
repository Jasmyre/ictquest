"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const updateUserName = async (name: string): Promise<void> => {
  const session = await auth();
  if (!session) return;

  const id = session.user.id;
  const newUserName = name;

  await db.user.update({
    where: { id },
    data: {
      userName: newUserName,
    },
  });

  console.log(await db.user.findUnique({ where: { id } }));

  revalidatePath("/profile");
};
