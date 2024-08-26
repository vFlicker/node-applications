import { parentPort, workerData } from "node:worker_threads";

function nthFibonacci(n) {
  if (n <= 1) return n;
  return nthFibonacci(n - 1) + nthFibonacci(n - 2);
}

function sendResult() {
  const fibonacciResult = nthFibonacci(+workerData);
  parentPort.postMessage(fibonacciResult);
}

sendResult();
