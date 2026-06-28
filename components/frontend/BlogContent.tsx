"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type BlogContentProps = {
  content: string;
  format?: "plain" | "markdown";
};

function splitPlainParagraphs(content: string): string[] {
  return content.split(/\n\s*\n/).filter((p) => p.trim());
}

export function BlogContent({ content, format = "plain" }: BlogContentProps) {
  if (format === "markdown") {
    return (
      <div className="prose prose-lg max-w-none text-gray-800 leading-loose text-base md:text-lg prose-headings:font-bold prose-headings:text-gray-900 prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-2xl prose-p:mb-5 prose-strong:text-gray-900">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => (
              <h2 className="mt-10 mb-4 text-2xl font-bold text-gray-900 border-l-4 border-brand-700 pl-4">
                {children}
              </h2>
            ),
            p: ({ children }) => {
              const text = String(children);
              if (text.startsWith("Q：") || text.startsWith("Q:")) {
                return <p className="mb-2 font-semibold text-gray-900">{children}</p>;
              }
              if (text.startsWith("A：") || text.startsWith("A:")) {
                return <p className="mb-6 text-gray-700">{children}</p>;
              }
              return <p className="mb-5">{children}</p>;
            },
            strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none text-gray-800 leading-loose whitespace-pre-line text-base md:text-lg">
      {splitPlainParagraphs(content).map((paragraph, index) => (
        <p key={index} className="mb-5">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
