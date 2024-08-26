import { createWriteStream } from "node:fs";
import { stdin } from "node:process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

async function write(filePath) {
  const writeStream = createWriteStream(filePath, { encoding: "utf8" });
  for await (const chunk of stdin) writeStream.write(chunk);
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const filePath = resolve(modulePath, "Files/fileToWrite.txt");

write(filePath);
