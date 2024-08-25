import { createReadStream, createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";

async function compress(sourcePath, destinationPath) {
  const readStream = createReadStream(sourcePath);
  const writeStream = createWriteStream(destinationPath);
  const gzip = createGzip();
  await pipeline(readStream, gzip, writeStream);
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const sourcePath = resolve(modulePath, "Files/fileToCompress.txt");
const destinationPath = resolve(modulePath, "Files/archive.gz");

compress(sourcePath, destinationPath);
