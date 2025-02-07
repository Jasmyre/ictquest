"use client";

import { Globe, RotateCw } from "lucide-react";
import { useEffect, useRef } from "react";

interface BrowserProps {
  title?: string;
  content?: string;
}
const Browser = ({
  title = "Browser",
  content = "",
}: BrowserProps) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow?.document;

      if (doc) {
        doc.open();
        doc.write(`${content}`);
        doc.close();
      }
    }
  });

  return (
    <div className="mt-2 flex flex-col gap-2 rounded-lg">
      <div className="w-full rounded-xl border-gray-200 dark:border-gray-700">
        <header className="flex gap-4 rounded-[.75rem_.75rem_0_0] border-none bg-indigo-600 p-2 px-4 text-primary-foreground text-white dark:bg-indigo-500">
          <Globe />
          <p>{title}</p>
        </header>
        <div className="flex items-center gap-2 border-b bg-gray-100 px-4 py-1 text-gray-700">
          <span className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="w-2 h-2 bg-yellow-500 rounded-full" />
          <span className="w-2 h-2 bg-green-500 rounded-full" />

          <RotateCw className="h-4 w-4" />

          <div className="border px-4 flex-1 ml-2 rounded bg-gray-200 place-self-end">
            http://localhost:3000/
          </div>
        </div>
        <div className="">
          <iframe
            className="px-2 py-4"
            title="Browser"
            ref={iframeRef}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              background: "white",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Browser;
