import { stdin, stdout } from "node:process";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

async function transform() {
  const transformStream = new Transform({
    transform(chunk, _encoding, callback) {
      const symbols = chunk.toString().split("");
      const newLineEscapeChar = symbols.pop();
      const reversedText = symbols.reverse().join("").concat(newLineEscapeChar);
      callback(null, reversedText);
    },
  });

  await pipeline(stdin, transformStream, stdout);
}

transform();
