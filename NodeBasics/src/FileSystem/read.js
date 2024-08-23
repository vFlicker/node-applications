import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

async function read(filePath) {
  try {
    const content = await readFile(filePath, { encoding: "utf8" });
    console.log(content);
  } catch (error) {
    throw new Error("FS operation failed");
  }
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const filePath = resolve(modulePath, "Files/fileToRead.txt");

read(filePath);
