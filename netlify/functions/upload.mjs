// Davy Gerry's Broadband Speed Tester — upload test receiver.
// Fully drains the POST body before responding, so the browser's upload
// progress reflects real network throughput rather than local socket-buffer
// fill. Nothing is logged or stored. GET returns OK so the page can detect
// that upload testing is available.

export default async (request) => {
  if (request.method === "POST") {
    // Drain the entire request body before responding — essential for an
    // accurate upload measurement.
    if (request.body) {
      const reader = request.body.getReader();
      try {
        while (true) {
          const { done } = await reader.read();
          if (done) break;
        }
      } catch (e) { /* connection closed early — ignore */ }
    } else {
      try { await request.arrayBuffer(); } catch (e) { /* ignore */ }
    }
  }
  return new Response("OK", {
    status: 200,
    headers: {
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
    },
  });
};

export const config = { path: "/.netlify/functions/upload" };
