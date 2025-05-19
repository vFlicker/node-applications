import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

async function create(filePath, content) {
  try {
    await writeFile(filePath, content, { encoding: "utf8", flag: "wx" });
    console.log("File created");
  } catch {
    throw new Error("FS operation failed");
  }
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const filePath = resolve(modulePath, "files/fresh.txt");
const fileContent = "I am fresh and young";

create(filePath, fileContent);
