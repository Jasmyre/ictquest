import { Code } from "lucide-react";
import Prism from "prismjs";
import { ReactNode, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css"; // Import Prism CSS for styling

interface BrowserProps {
  children?: ReactNode;
  language?: string;
}

const CodeBlock = ({ children, language = "html" }: BrowserProps) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [children]);

  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  return (
    <div className="rounded-xl border border-gray-300 dark:border-gray-700">
      <header className="flex gap-4 rounded-[.75rem_.75rem_0_0] bg-indigo-500 p-2 px-4 text-gray-200">
        <Code /> <p>{language}</p>
      </header>
      <pre
        style={{ margin: 0, padding: ".5rem 1rem", border: "none", minHeight: "20vh" }}
        className="m-0 p-2"
      >
        <code 
          className={`language-${language} m-0 h-full min-h-[20vh] rounded-[0_0_.75rem_.75rem] border-none bg-[#282C34]`} // Use the language prop for dynamic class
          dangerouslySetInnerHTML={{ __html: escapeHtml(children as string) }}
        />
      </pre>
    </div>
  );
};

export default CodeBlock;
