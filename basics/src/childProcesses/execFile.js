import { promisify } from "node:util";
import { execFile } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// execFile similar to exec, but runs a file directly without using a shell.
// Use it when executing binary files or scripts without
// a shell for better security and performance.

const promisifiedExecFile = promisify(execFile);

async function executePythonScript(filePath) {
  const { stdout, stderr } = await promisifiedExecFile("python", [filePath]);

  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }

  console.log(`Output: ${stdout}`);
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const filePath = resolve(modulePath, "files/script.py");

executePythonScript(filePath);
