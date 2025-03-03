import { spawn } from "node:child_process";

// spawn launches a new command in a separate process without blocking
// the main Node.js process. Use it for long-running processes
// with large data output, such as streaming or continuous tasks.

function convertVideo() {
  const ffmpeg = spawn("ffmpeg", [
    "-i",
    "input.mp4",
    "-vf",
    "scale=1280:720",
    "output.mp4",
  ]);

  ffmpeg.stderr.on("data", (data) => {
    const output = data.toString();
    if (output.includes("time=")) {
      const time = output.match(/time=(\d+:\d+:\d+)/)[1];
      console.log(`Current progress: ${time}`);
    }
  });

  ffmpeg.on("close", (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
  });
}

convertVideo();
