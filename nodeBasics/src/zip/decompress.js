import { createReadStream, createWriteStream } from "node:fs";
import { createUnzip } from "node:zlib";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";

async function decompress(sourcePath, destinationPath) {
  const readStream = createReadStream(sourcePath);
  const writeStream = createWriteStream(destinationPath);
  const unzip = createUnzip();
  await pipeline(readStream, unzip, writeStream);
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const sourcePath = resolve(modulePath, "files/archive.gz");
const destinationPath = resolve(modulePath, "files/fileToCompress2.txt");

decompress(sourcePath, destinationPath);
