"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { cn } from "@/lib/utils";
import { MealCitation } from "./meal-citation";

interface CravelyMessageProps {
  content: string;
  isStreaming?: boolean;
}

export function CravelyMessage({ content, isStreaming = false }: CravelyMessageProps) {
  // Pre-process content to fix malformed tags like <cite sxngr.../> into <cite id="sxngr..."/>
  const processedContent = content.replace(/<cite\s+([^"'>\s/]+)\s*\/>/g, '<cite id="$1" />');

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:mb-4 prose-p:last:mb-0 prose-headings:font-black prose-headings:tracking-tight prose-headings:mb-2 prose-strong:font-black prose-strong:text-primary prose-ul:my-2 prose-li:my-0.5">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // @ts-ignore
          cite: ({ id }) => {
            if (!id) return null;
            return <MealCitation id={id} />;
          },
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-black text-primary">{children}</strong>,
          ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-2">{children}</ol>,
          li: ({ children }) => <li className="text-sm">{children}</li>,
        }}
      >
        {processedContent}
      </ReactMarkdown>
      
      {isStreaming && (
        <span
          className="inline-block h-3 w-1 ml-1 bg-primary/70 animate-pulse align-middle"
          aria-label="Cravely is typing"
        />
      )}
    </div>
  );
}
