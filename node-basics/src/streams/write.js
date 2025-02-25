import { createWriteStream } from "node:fs";
import { stdin } from "node:process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

async function write(filePath) {
  const writeStream = createWriteStream(filePath, { encoding: "utf8" });
  // stdin.pipe(writeStream); can be used instead of for loop
  for await (const chunk of stdin) writeStream.write(chunk);
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const filePath = resolve(modulePath, "files/fileToWrite.txt");

write(filePath);
