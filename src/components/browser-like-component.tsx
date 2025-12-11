import type React from "react";
import { useEffect, useRef } from "react";

const BrowserLikeComponent: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

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
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body>
                        <button>Click me!</button>
                    </body>
                    </html>
                `);
        doc.close();
      }
    }
  }, []);

  return (
    <div
      className="browser"
      style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
    >
      <iframe
        ref={iframeRef}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          background: "white",
        }}
        title="Browser"
      />
    </div>
  );
};

export default BrowserLikeComponent;
