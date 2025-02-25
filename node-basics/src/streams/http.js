import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { dirname, resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { createGzip } from "node:zlib";

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const modulePath = dirname(__filename);
  const filePath = resolve(modulePath, "files/index.html");

  const buffer = await readAndCompress(filePath);
  startServer(buffer);
}

async function readAndCompress(filePath) {
  const chunks = [];
  const fileStream = createReadStream(filePath);
  const gzip = createGzip();

  async function* streamToChunks(source) {
    for await (const chunk of source) {
      chunks.push(chunk);
      yield chunk;
    }
  }

  await pipeline(fileStream, gzip, streamToChunks);
  return Buffer.concat(chunks);
}

function startServer(buffer) {
  const port = 8000;

  const server = createServer((_request, response) => {
    const headers = { "Content-Type": "text/html", "Content-Encoding": "gzip" };
    response.writeHead(200, headers);
    response.end(buffer);
  });

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}

main();
