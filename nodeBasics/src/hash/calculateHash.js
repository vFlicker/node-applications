import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

async function calculateHash(filePath) {
  const hashStream = createHash("sha256");
  const readStream = createReadStream(filePath, { encoding: "utf8" });
  // readStream.pipe(hash); can be used instead of for loop
  for await (const chunk of readStream) hashStream.update(chunk);
  console.log(`The hash of the file is: ${hashStream.digest("hex")}`);
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const filePath = resolve(modulePath, "files/fileToCalculateHashFor.txt");

calculateHash(filePath);
