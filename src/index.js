// Test package just re-exports the builtin stream module as an example.
import stream from "test-package";

// If you want to see things running correctly, comment out the above and use native stream directly.
// import stream from "stream";

export async function handler(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  stream.Readable.from("Hello World!").pipe(res);
}
