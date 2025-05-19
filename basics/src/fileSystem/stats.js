import { readdir, lstat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

async function stats(directoryPath) {
  try {
    const files = await readdir(directoryPath);
    const promises = files.map((file) => lstat(resolve(directoryPath, file)));
    const data = await Promise.all(promises);
    console.log(data);
  } catch {
    throw new Error("FS operation failed");
  }
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const directoryPath = resolve(modulePath, "files");

stats(directoryPath);
