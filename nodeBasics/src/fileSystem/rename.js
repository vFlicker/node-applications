import { rename as renameFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

async function rename(sourcePath, destinationPath) {
  try {
    await renameFile(sourcePath, destinationPath);
    console.log("File renamed");
  } catch (err) {
    throw new Error("FS operation failed");
  }
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const sourcePath = resolve(modulePath, "files/wrongFilename.txt");
const destinationPath = resolve(modulePath, "files/properFilename.md");

rename(sourcePath, destinationPath);
