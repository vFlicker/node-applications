import { readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

async function list(directoryPath) {
  try {
    const directory = await readdir(directoryPath);
    console.log(directory);
  } catch (err) {
    throw new Error("FS operation failed");
  }
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const directoryPath = resolve(modulePath, "Files");

list(directoryPath);
