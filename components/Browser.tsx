"use client";

import { Globe, RotateCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface BrowserProps {
  title?: string;
  content?: string;
}

const Browser = ({ title = "Browser", content = "" }: BrowserProps) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [iframeHeight, setIframeHeight] = useState<string>("auto");

  const handleRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  useEffect(() => {
    if (iframeRef.current) {
      const doc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow?.document;

      if (doc) {
        doc.open();
        doc.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { 
      margin: 0; 
      padding: 1rem; 
      font-family: Arial, sans-serif;
      overflow-y: auto; 
    }
    
    /* Barely visible scrollbar */
    ::-webkit-scrollbar {
      width: 4px; /* Thin scrollbar */
    }
    ::-webkit-scrollbar-track {
      background: transparent; /* No track */
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1); /* Faint thumb */
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.2); /* Slightly darker on hover */
    }
  </style>
</head>
<body onload="parent.postMessage({ height: document.body.scrollHeight }, '*')">
  ${content}
</body>
</html>
        `);
        doc.close();
      }
    }
  }, [content, refreshCounter, title]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.height) {
        setIframeHeight(
          `${Math.min(event.data.height, window.innerHeight * 0.75)}px`,
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const onLoad = () => {
    if (!iframeRef.current) return null;

    iframeRef.current.style.height =
      iframeRef.current?.contentWindow?.document.body.scrollHeight + "px";
  };

  return (
    <div className="mt-2 flex flex-col gap-2 rounded-lg">
      <div className="w-full rounded-xl border-gray-200 dark:border-gray-700">
        <header className="flex gap-4 rounded-t-xl bg-indigo-600 p-2 px-4 text-white">
          <Globe />
          <p>{title}</p>
        </header>
        <div className="flex items-center justify-center gap-2 border-b bg-gray-100 px-4 py-1 text-gray-700">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="h-2 w-2 rounded-full bg-yellow-500" />
          <span className="h-2 w-2 rounded-full bg-green-500" />

          <RotateCw onClick={handleRefresh} className="h-4 w-4" />

          <div className="flex flex-1 items-center justify-center place-self-end rounded border bg-gray-200 px-4">
            http://localhost:3000/
          </div>
        </div>
        <div>
          <iframe
            key={refreshCounter}
            className="px-2 py-4"
            title={title}
            ref={iframeRef}
            onLoad={onLoad}
            style={{
              width: "100%",
              height: iframeHeight,
              border: "none",
              background: "white",
              maxHeight: "75vh",
              transition: "height 0.3s ease-in-out",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Browser;
