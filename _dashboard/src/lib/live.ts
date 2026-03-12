type LiveEvent = {
  type: "page" | "collection";
  key?: string;
  collection?: string;
  slug?: string;
  locale?: string;
  ts: number;
};

const clients: Set<ReadableStreamDefaultController> = new Set();

export function addLiveClient(controller: ReadableStreamDefaultController) {
  clients.add(controller);
}

export function removeLiveClient(controller: ReadableStreamDefaultController) {
  clients.delete(controller);
}

export function broadcastContentUpdated(
  payload: { type: "page"; key: string; locale: string } | { type: "collection"; collection: string; slug: string; locale: string }
) {
  const event: LiveEvent = {
    ...payload,
    ts: Date.now(),
  };
  const data = JSON.stringify(event);
  const msg = `event: content-updated\ndata: ${data}\n\n`;

  for (const ctrl of clients) {
    try {
      ctrl.enqueue(new TextEncoder().encode(msg));
    } catch {
      clients.delete(ctrl);
    }
  }
}
