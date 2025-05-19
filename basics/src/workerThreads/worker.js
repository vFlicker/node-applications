import { parentPort, workerData } from "node:worker_threads";

function sendFibonacciToParent() {
  const fibonacciResult = calculateNthFibonacci(+workerData);
  parentPort.postMessage(fibonacciResult);
}

function calculateNthFibonacci(n) {
  if (n <= 1) return n;
  return calculateNthFibonacci(n - 1) + calculateNthFibonacci(n - 2);
}

sendFibonacciToParent();
