import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    return null
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    return null
  }
};

export const getAllUsers = async () => {
  try {
    const users = await  db.user.findMany({
      select: {
        id: true,
        userName: true,
        image: true,
      }
    });
    console.log(users)

    return users;
  } catch (error) {
    console.error(error);
    return null;
  }
}