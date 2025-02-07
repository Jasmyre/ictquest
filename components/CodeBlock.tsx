"use client";


interface CodeBlockProps {
  content: string;
}

const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const CodeBlock = ({ content }: CodeBlockProps) => {
  // this is not a code
  // useEffect(() => {
  //   Prism.highlightAll();
  // }, []);

  return (
    <pre>
      <code
        className="language-html"
        dangerouslySetInnerHTML={{
          __html: escapeHtml(
            content,
          ),
        }}
      ></code>
    </pre>
  );
};

export default CodeBlock;
