function concat(firstString, secondString) {
  const firstBuffer = Buffer.from(firstString);
  const secondBuffer = Buffer.from(secondString);
  const slicedFistBuffer = firstBuffer.subarray(0, 7);
  const concat = Buffer.concat([slicedFistBuffer, secondBuffer]);
  console.log(concat.toString());
}

concat("Hello, Buffer", "World!");
