import React from "react";

import { auth } from "@/auth";

const page = async () => {
  const session = await auth();

  return (
    <div>
      Settings page
      <br />
      <br />
      <pre>
        <code>{JSON.stringify(session, null, "\t")}</code>
      </pre>
    </div>
  );
};

export default page;
