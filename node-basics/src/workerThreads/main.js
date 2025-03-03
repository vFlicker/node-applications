import { Worker } from "node:worker_threads";
import { cpus } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

async function performCalculations(filePath) {
  const numCPUs = cpus().length;
  const promises = [];

  for (let i = 0; i < numCPUs; i++) {
    const numberToSend = 10 + i;
    const promiseResult = createWorker(filePath, numberToSend);
    promises.push(promiseResult);
  }

  const settledResult = await Promise.allSettled(promises);

  return settledResult.map(({ status, value }) => {
    if (status === "rejected") return { status: "error", data: null };
    return { status: "resolved", data: value };
  });
}

function createWorker(filePath, workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(filePath, { workerData });
    worker.on("message", (message) => resolve(message));
    worker.on("error", (error) => reject(error));
  });
}

const __filename = fileURLToPath(import.meta.url);
const modulePath = dirname(__filename);
const filePath = resolve(modulePath, "worker.js");

const result = await performCalculations(filePath);
console.log(result);
