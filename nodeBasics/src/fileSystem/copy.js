import { copyFile, constants } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

async function copy(sourcePath, destinationPath) {
  try {
    await copyFile(sourcePath, destinationPath, constants.COPYFILE_EXCL);
    console.log("File copied");
  } catch (err) {
    throw new Error("FS operation failed");
  }
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const sourcePath = resolve(modulePath, "files/fresh.txt");
const destinationPath = resolve(modulePath, "filesCopy/fresh.txt");

copy(sourcePath, destinationPath);
