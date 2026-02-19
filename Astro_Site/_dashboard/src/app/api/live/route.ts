import { addLiveClient, removeLiveClient } from "@/lib/live";

export const dynamic = "force-dynamic";

export async function GET() {
  let ctrl: ReadableStreamDefaultController | null = null;

  const stream = new ReadableStream({
    start(controller) {
      ctrl = controller;
      addLiveClient(controller);

      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(": keepalive\n\n"));
        } catch {
          clearInterval(keepAlive);
        }
      }, 15000);

      const cleanup = () => {
        clearInterval(keepAlive);
        if (ctrl) {
          removeLiveClient(ctrl);
          ctrl = null;
        }
      };

      (controller as unknown as { _cleanup?: () => void })._cleanup = cleanup;
    },
    cancel() {
      if (ctrl) {
        removeLiveClient(ctrl);
        ctrl = null;
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
