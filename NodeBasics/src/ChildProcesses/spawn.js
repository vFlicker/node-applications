import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function executePythonScript(filePath) {
  const pythonProcess = spawn("python", [filePath]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Output: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Child process exited with code ${code}`);
  });
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const filePath = resolve(modulePath, "Files/script.py");

executePythonScript(filePath);
