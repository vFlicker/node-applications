function encodeDecode(string) {
  const buffer = Buffer.from(string);

  console.log(`Original string: ${string}`);
  console.log(`Buffer: ${buffer}`);

  const base64Encoded = buffer.toString("base64");
  console.log(`Base64 encoded: ${base64Encoded}`);

  const decodedBuffer = Buffer.from(base64Encoded, "base64");
  console.log(`Decoded buffer: ${decodedBuffer}`);
}

encodeDecode("Hello, Buffer");
