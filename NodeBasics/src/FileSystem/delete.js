import { rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

async function remove(filePath) {
  try {
    await rm(filePath);
    console.log("File deleted");
  } catch (err) {
    throw new Error("FS operation failed");
  }
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const filePath = resolve(modulePath, "Files/fileToRemove.txt");

remove(filePath);
