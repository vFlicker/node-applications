import { Worker } from "node:worker_threads";
import { cpus } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function createWorker(filePath, numberToSend) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(filePath, { workerData: numberToSend });
    worker.on("message", (message) => resolve(message));
    worker.on("error", (error) => reject(error));
  });
}

async function performCalculations(filePath) {
  const numCPUs = cpus().length;
  const tasks = [];

  for (let i = 0; i < numCPUs; i++) {
    const numberToSend = 10 + i;
    const newTask = createWorker(filePath, numberToSend);
    tasks.push(newTask);
  }

  const settledResult = await Promise.allSettled(tasks);

  return settledResult.map(({ status, value }) => {
    if (status === "fulfilled") return { status: "resolved", data: value };
    else return { status: "error", data: null };
  });
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const filePath = resolve(modulePath, "worker.js");

const result = await performCalculations(filePath);
console.log(result);
