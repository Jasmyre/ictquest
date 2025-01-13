
import { ReactNode } from "react";
import { Code } from "lucide-react";

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface BrowserProps {
  children?: ReactNode;
  language: string;
}

const CodeBlock = ({ children, language = "html" }: BrowserProps) => {

  return (
    <div className="rounded-xl border border-gray-300 dark:border-gray-900">
      <header className="flex gap-4 rounded-[.75rem_.75rem_0_0] bg-primary p-2 px-4 text-primary-foreground">
        <Code /> <p>{language}</p>
      </header>
      <div className="browser min-h-[20vh] p-2 px-4 bg-[#282C34] rounded-[0_0_.75rem_.75rem]">
        <SyntaxHighlighter language="html" style={atomOneDark}>
            {children as string}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
