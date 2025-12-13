import Link from "next/link";
import { auth, signOut } from "@/auth";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { Button } from "./ui/button";

const SigninButton = async () => {
  const session = await auth();

  if (session) {
    const user = await getUserById(session?.user.id as string);
    const id = user?.id;

    if (!user?.userName) {
      await db.user.update({
        where: { id },
        data: {
          userName: user?.name,
        },
      });
    }
  }

  return (
    <>
      {session ? (
        <form
          action={async () => {
            "use server";

            await signOut();
          }}
        >
          <Button
            className="w-full border-white bg-transparent text-white hover:bg-white hover:text-indigo-600 sm:w-auto dark:hover:bg-gray-200 dark:hover:text-indigo-800"
            size="lg"
            variant="outline"
          >
            Sign Out
          </Button>
        </form>
      ) : (
        <Link href="/auth">
          <Button
            className="w-full border-white bg-transparent text-white hover:bg-white hover:text-indigo-600 sm:w-auto dark:hover:bg-gray-200 dark:hover:text-indigo-800"
            size="lg"
            variant="outline"
          >
            Sign In
          </Button>
        </Link>
      )}
    </>
  );
};

export default SigninButton;
