export default async (request) => {
  if (request.method === "POST") {
    try { await request.arrayBuffer(); } catch (e) { /* discard */ }
  }
  return new Response("OK", {
    status: 200,
    headers: { "cache-control": "no-store" },
  });
};
