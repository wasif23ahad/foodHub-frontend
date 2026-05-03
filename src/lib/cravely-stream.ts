import { API_URL } from "@/lib/api";


type StreamOptions = {
  message: string;
  sessionId?: string | null;
  onToken: (text: string) => void;
  onDone: (payload: { sessionId: string }) => void;
};

function getAuthHeaders() {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof document !== "undefined") {
    const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function streamCravelyChat(options: StreamOptions) {
  const response = await fetch(`${API_URL}/ai/chat`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({
      message: options.message,
      sessionId: options.sessionId ?? undefined,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message || "Cravely is unavailable right now.");
  }

  if (!response.body) {
    throw new Error("Cravely stream did not start.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const eventBlock of events) {
      const event = eventBlock.match(/^event:\s*(.+)$/m)?.[1];
      const dataLine = eventBlock.match(/^data:\s*(.+)$/m)?.[1];
      if (!event || !dataLine) continue;

      const data = JSON.parse(dataLine) as Record<string, unknown>;
      if (event === "token" && typeof data["text"] === "string") {
        options.onToken(data["text"]);
      }
      if (event === "done" && typeof data["sessionId"] === "string") {
        options.onDone({ sessionId: data["sessionId"] });
      }
      if (event === "error" && typeof data["message"] === "string") {
        throw new Error(data["message"]);
      }
    }
  }
}
