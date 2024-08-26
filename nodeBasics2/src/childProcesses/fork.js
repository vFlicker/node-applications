import { fork } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function spawnChildProcess(filePath, args) {
  const worker = fork(filePath, args, {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
  });

  process.stdin.pipe(worker.stdin);
  worker.stdout.pipe(process.stdout);
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const filePath = resolve(modulePath, "Files/worker.js");

spawnChildProcess(filePath, ["arg1", "arg2"]);
