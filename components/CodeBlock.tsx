"use client"

import { useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

interface CodeBlockProps {
    content: string;
}

const CodeBlock = ({ content }: CodeBlockProps) => {
	useEffect(() => {
		hljs.highlightAll();
	}, []);

	return (
		<pre>
			<code className="language-html">{content}</code>
		</pre>
	);
};

export default CodeBlock;
