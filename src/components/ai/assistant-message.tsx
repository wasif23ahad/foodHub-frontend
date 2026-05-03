"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { parseAssistantMessage } from "@/lib/ai/parse-message";
import { CitationChip } from "./citation-chip";

interface Props {
  content: string;
  /** True while the message is still streaming. Lets us suppress trailing partial-tag flicker. */
  isStreaming?: boolean;
}

export function AssistantMessage({ content, isStreaming = false }: Props) {
  const segments = parseAssistantMessage(content);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none wrap-break-word *:first:mt-0 *:last:mb-0">
      {segments.map((seg, i) => {
        if (seg.type === "citation") {
          return <CitationChip key={`${seg.mealId}-${i}`} mealId={seg.mealId} />;
        }
        return (
          <ReactMarkdown
            key={i}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
            components={{
              // Inline-friendly defaults so consecutive segments flow as one paragraph
              p: ({ children }) => <span className="block mb-2 last:mb-0">{children}</span>,
              ul: ({ children }) => (
                <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 font-bold"
                >
                  {children}
                </a>
              ),
              code: ({ children }) => (
                <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                  {children}
                </code>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
            }}
          >
            {seg.content}
          </ReactMarkdown>
        );
      })}
      {isStreaming && (
        <span
          className="inline-block h-3 w-1 ml-0.5 bg-foreground/70 animate-pulse align-middle"
          aria-label="Cravely is typing"
        />
      )}
    </div>
  );
}
