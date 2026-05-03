export type MessageSegment =
  | { type: "markdown"; content: string }
  | { type: "citation"; mealId: string };

// Matches: <cite id="meal_abc"/>  OR  <cite id='meal_abc'/>  OR  <cite id="meal_abc" />
// Lenient enough to tolerate whitespace; strict enough to need a closing />
const CITATION_RE = /<cite\s+id\s*=\s*["']([^"']+)["']\s*\/>/g;

// During streaming we may see a partial tag like "<cite id=\"meal_ab"
// We detect that and leave it as-is so it doesn't get rendered as garbage.
const PARTIAL_CITE_RE = /<cite\b[^>]*$/;

export function parseAssistantMessage(raw: string): MessageSegment[] {
  if (!raw) return [];

  // Strip a trailing partial tag so it doesn't render mid-stream
  const partialMatch = raw.match(PARTIAL_CITE_RE);
  const safeRaw = partialMatch
    ? raw.slice(0, partialMatch.index)
    : raw;

  const segments: MessageSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset regex state in case of reuse
  CITATION_RE.lastIndex = 0;

  while ((match = CITATION_RE.exec(safeRaw)) !== null) {
    const [fullMatch, mealId] = match;
    const before = safeRaw.slice(lastIndex, match.index);
    if (before) segments.push({ type: "markdown", content: before });
    segments.push({ type: "citation", mealId });
    lastIndex = match.index + fullMatch.length;
  }

  const tail = safeRaw.slice(lastIndex);
  if (tail) segments.push({ type: "markdown", content: tail });

  return segments;
}
