import React from "react";

import { auth } from "@/auth";
import { Suspense } from "react";

const page = async () => {
  return (
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
};

const Data = async () => {
  const session = await auth();
  return <code>{JSON.stringify(session, null, "\t")}</code>;
};

export default page;
