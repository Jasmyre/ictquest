"use client";

import { Globe } from "lucide-react";
import React, { useEffect, useRef, ReactNode } from "react";

interface BrowserProps {
  children?: ReactNode;
  title?: string;
  content?: string;
}
const Browser = ({
  children = "",
  title = "Great job!",
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

  console.log(title);
  console.log(children);
  

  return (
    <div className="mt-2 flex flex-col gap-2 rounded-lg">
      <div className="w-full rounded-xl border-gray-200 dark:border-gray-700">
        <header className="flex gap-4 rounded-[.75rem_.75rem_0_0] border-none bg-indigo-600 p-2 px-4 text-primary-foreground text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
          <Globe />
          <p>Browser</p>
        </header>
        <div className="min-h-[20vh] rounded-md rounded-tl-none rounded-tr-none border border-gray-300 bg-gray-100 p-2 px-4 py-10 text-black dark:border-gray-900">
          <div className="browserCode">{children}</div>
          <div
            className="browser"
            style={{ width: "100%", height: "100%", border: "1px solid #ccc" }}
          >
            <iframe
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
    </div>
  );
};

export default Browser;
