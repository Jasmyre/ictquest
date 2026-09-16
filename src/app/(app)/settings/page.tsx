import { Suspense } from "react";
import { auth } from "@/auth";

const page = async () => (
  <div>
    Settings page
    <br />
    <br />
    <pre>
      <Suspense>
        <Data />
      </Suspense>
    </pre>
  </div>
);

const Data = async () => {
  const session = await auth();
  return <code>{JSON.stringify(session, null, "\t")}</code>;
};

export default page;
