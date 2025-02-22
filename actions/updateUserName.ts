"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const updateUserName = async (formData: FormData): Promise<void> => {
  const session = await auth();
  if (!session) return;

  const id = session.user.id;
  const newUserName = formData.get("inputName") as string;

  await db.user.update({
    where: { id },
    data: {
      userName: newUserName,
    },
  });

  console.log(await db.user.findUnique({ where: { id } }));

  revalidatePath("/profile");
};
