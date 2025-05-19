import { promisify } from "node:util";
import { exec } from "node:child_process";

// exec runs a command in a shell and buffers the entire output in memory.
// Use it for simple commands with small data output,
// but avoid it for large outputs to prevent memory issues.

const promisifiedExec = promisify(exec);

async function executeCommand(command) {
  const { stdout, stderr } = await promisifiedExec(command);

  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }

  console.log(`Output: ${stdout}`);
}

executeCommand("ls -la");
