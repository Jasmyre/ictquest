"use client"

import React, { useEffect, useRef, ReactNode } from "react";

interface BrowserProps {
  children?: ReactNode;
  title?: string;
  content?: string;
}
const Browser = ({
  children = "",
  title = "Great job!",
  content = ""
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
    <div className="mt-2 p-2 bg-emerald-500 dark:bg-emerald-800 rounded-lg flex flex-col gap-2">
      <p className="text-green-100 dark:text-green-200">{title}</p>
      <div className="w-full rounded-xl border-gray-200 dark:border-gray-700 ">
        {/* <header className="flex gap-4 p-2 px-4  border-none bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-600 rounded-[.75rem_.75rem_0_0] text-primary-foreground">
        <Globe />
        <p>Browser</p>
      </header> */}
        {/* <div className="rounded-md p-2 px-4 py-10 min-h-[20vh] border border-gray-300 dark:border-gray-900 bg-gray-100 text-black "> */}
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
        {/* </div> */}
      </div>
    </div>
  );
};

export default Browser;
