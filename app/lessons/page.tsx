
import { getUserStats } from "@/data/user";
import RenderTopics from "./RenderTopics";
import { auth } from "@/auth";

export default async function LessonsPage() {
  const session = await auth();
  const id = session?.user.id

  const user = await getUserStats(id!);
  console.log(user);

  return (
    <RenderTopics user={user!}/>
  );
}
