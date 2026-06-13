// Davy Gerry's Broadband Speed Tester — upload test receiver.
// Receives POST data from the speed test and discards it immediately.
// Nothing is logged or stored.

export default async (request) => {
  if (request.method === "POST") {
    try { await request.arrayBuffer(); } catch (e) { /* discard */ }
  }
  return new Response("OK", {
    status: 200,
    headers: { "cache-control": "no-store" },
  });
};
