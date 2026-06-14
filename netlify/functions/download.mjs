// Davy Gerry's Broadband Speed Tester — download test data source.
// Streams freshly-generated random bytes that can never be served from cache,
// so the measured speed reflects the real network path, not an edge-cached copy.
//
// Query: ?bytes=N  (clamped 1..50 MB). Default 25 MB.
// Nothing is logged or stored.

export default async (request) => {
  const url = new URL(request.url);
  let bytes = parseInt(url.searchParams.get("bytes") || "26214400", 10);
  if (isNaN(bytes) || bytes < 1) bytes = 26214400;
  if (bytes > 52428800) bytes = 52428800; // 50 MB hard cap per request

  const CHUNK = 65536; // 64 KB — also the crypto.getRandomValues limit
  let sent = 0;

  const stream = new ReadableStream({
    pull(controller) {
      if (sent >= bytes) { controller.close(); return; }
      const size = Math.min(CHUNK, bytes - sent);
      const buf = new Uint8Array(size);
      crypto.getRandomValues(buf);
      controller.enqueue(buf);
      sent += size;
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "application/octet-stream",
      "content-length": String(bytes),
      "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
      "pragma": "no-cache",
      "access-control-allow-origin": "*",
    },
  });
};

export const config = { path: "/download-test" };
