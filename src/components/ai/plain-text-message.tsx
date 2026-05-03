"use client";

import { cn } from "@/lib/utils";

interface PlainTextMessageProps {
  content: string;
  isStreaming?: boolean;
}

export function PlainTextMessage({ content, isStreaming = false }: PlainTextMessageProps) {
  return (
    <div className="whitespace-pre-wrap break-words">
      {content}
      {isStreaming && (
        <span
          className="inline-block h-3 w-1 ml-1 bg-primary/70 animate-pulse align-middle"
          aria-label="Cravely is typing"
        />
      )}
    </div>
  );
}
