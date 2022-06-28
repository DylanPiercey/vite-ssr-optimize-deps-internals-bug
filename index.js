const { NODE_ENV = "development", PORT = 3000 } = process.env;
let app;

if (NODE_ENV === "production") {
  // In production, simply start up the http server.
  const { createServer } = await import("http");
  app = createServer((await import("./dist/server/index.js")).handler);
} else {
  // In dev we'll start a Vite dev server in middleware mode,
  // and forward requests to our http request handler.
  const { createServer } = await import("vite");
  const devServer = await createServer({
    appType: "custom",
    server: { middlewareMode: true },
  });
  app = devServer.middlewares.use(async (req, res, next) => {
    try {
      (await devServer.ssrLoadModule("./src/index.js")).handler(req, res, next);
    } catch (err) {
      devServer.ssrFixStacktrace(err);
      return next(err);
    }
  });
}

const server = app.listen(PORT, (err) => {
  exitIfError(err);
  console.log(`Env: ${NODE_ENV}`);
  console.log(`Address: http://localhost:${server.address().port}`);
});

function exitIfError(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
}
