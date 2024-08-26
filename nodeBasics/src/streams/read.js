import { createReadStream } from "node:fs";
import { stdout } from "node:process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

async function read(filePath) {
  const readStream = createReadStream(filePath, { encoding: "utf8" });
  for await (const chunk of readStream) stdout.write(chunk);
  stdout.write("\n");
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const filePath = resolve(modulePath, "files/fileToRead.txt");

read(filePath);
