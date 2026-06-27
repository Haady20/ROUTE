const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { pipeline } = require("stream/promises");

async function run() {
  // 1
  const bigFilePath = path.join(__dirname, "big.txt");
  const readStream = fs.createReadStream(bigFilePath, {
    encoding: "utf8",
    highWaterMark: 64
  });

  for await (const chunk of readStream) {
    console.log(chunk);
  }

  // 2
  const sourcePath = path.join(__dirname, "source.txt");
  const destinationPath = path.join(__dirname, "dest.txt");

  await pipeline(
    fs.createReadStream(sourcePath),
    fs.createWriteStream(destinationPath)
  );

  console.log("File copied using streams");

  // 3
  const dataPath = path.join(__dirname, "data.txt");
  const compressedPath = path.join(__dirname, "data.txt.gz");

  await pipeline(
    fs.createReadStream(dataPath),
    zlib.createGzip(),
    fs.createWriteStream(compressedPath)
  );

  console.log("File compressed successfully");
}

run().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
