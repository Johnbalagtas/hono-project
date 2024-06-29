import app from "./app.ts";

const server = Bun.serve({
  fetch: app.fetch,
});

console.log("Hello via Bun!", server);
