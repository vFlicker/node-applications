import { fork } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// fork a specialized version of spawn designed specifically for creating
// new Node.js processes. Use it when you need communication between
// the parent and child processes, such as sending messages or sharing data.

function spawnChildProcess(filePath, args) {
  const worker = fork(filePath, args, {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
  });

  process.stdin.pipe(worker.stdin);
  worker.stdout.pipe(process.stdout);
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const filePath = resolve(modulePath, "files/worker.js");

spawnChildProcess(filePath, ["arg1", "arg2"]);
