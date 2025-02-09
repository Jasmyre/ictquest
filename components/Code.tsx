import { Code } from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // import prism css

interface CodeBlockProps {
  language?: string;
  initialCode: string[];
  code?: string; // dynamic middle part
}

const CodeBlock = ({
  language = "html",
  initialCode,
  code = "",
}: CodeBlockProps) => {
  // get the header and footer from initialCode
  const header = initialCode && initialCode.length > 0 ? initialCode[0] : "";
  const footer =
    initialCode && initialCode.length > 1
      ? initialCode[initialCode.length - 1]
      : "";
  const combinedCode = header + code + footer;

  // use prism.highlight to get the highlighted html
  const highlightedCode = Prism.highlight(
    combinedCode,
    Prism.languages[language] || Prism.languages.markup,
    language,
  );

  return (
    <div className="rounded-xl border border-gray-300 dark:border-gray-700">
      <header className="flex gap-4 rounded-t-xl bg-indigo-500 p-2 px-4 text-gray-200">
        <Code /> <p>{language}</p>
      </header>
      <pre
        style={{
          margin: 0,
          padding: ".5rem 1rem",
          border: "none",
          minHeight: "20vh",
        }}
        className="m-0 bg-[#2D2D2D] p-2"
      >
        <code
          className={`language-${language} m-0 h-full min-h-[20vh] rounded-b-xl border-none bg-[2D2D2D]`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
};

export default CodeBlock;
