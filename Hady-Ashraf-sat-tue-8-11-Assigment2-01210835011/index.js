const path = require("path");
const fs = require("fs");
const os = require("os");
const EventEmitter = require("events");

// Q1
function getCurrentLocation() {
  console.log({
    File: __filename,
    Dir: __dirname,
  });
}
getCurrentLocation();

// Q2
function getFileName(filePath) {
  return path.basename(filePath);
}
console.log(getFileName("/user/files/report.pdf"));


// Q3
function buildPath(pathObject) {
  return path.format(pathObject);
}
console.log(
  buildPath({
    dir: "/folder",
    name: "app",
    ext: ".js",
  }),
);

// Q4
function getFileExtension(filePath) {
  return path.extname(filePath);
}
console.log(getFileExtension("/docs/readme.md"));

// Q5
function getNameAndExtension(filePath) {
  const parsedPath = path.parse(filePath);

  return {
    Name: parsedPath.name,
    Ext: parsedPath.ext,
  };
}
console.log(getNameAndExtension("/home/app/main.js"));


// Q6
function checkAbsolutePath(filePath) {
  return path.isAbsolute(filePath);
}
console.log(checkAbsolutePath("/home/user/file.txt"));

// Q7
function joinMultipleSegments(...segments) {
  return path.join(...segments);
}
console.log(joinMultipleSegments("src", "components", "App.js"));

// Q8
function resolveToAbsolute(relativePath) {
  return path.resolve(relativePath);
}
console.log(resolveToAbsolute("./index.js"));


// Q9
function joinTwoPaths(firstPath, secondPath) {
  return path.join(firstPath, secondPath);
}
console.log(joinTwoPaths("/folder1", "folder2/file.txt"));

// Q10
function deleteFileAsync(filePath) {
  fs.unlink(filePath, (error) => {
    if (error) {
      console.log(`Failed to delete file: ${error.message}`);
      return;
    }
    console.log(`The ${path.basename(filePath)} is deleted.`);
  });
}
const fileToDelete = path.join(__dirname, "DeleteMe.txt");
fs.writeFileSync(fileToDelete, "Temporary file");
deleteFileAsync(fileToDelete);

// Q11
function createFolderSync(folderPath) {
  fs.mkdirSync(folderPath, {
    recursive: true,
  });
  return "Success";
}
const newFolderPath = path.join(__dirname, "NewFolder");
console.log(createFolderSync(newFolderPath));

// Q12
const emitter = new EventEmitter();
emitter.on("start", () => {
  console.log("Welcome event triggered");
});
emitter.emit("start");

// Q13
emitter.on("login", (username) => {
  console.log(`User logged in: ${username}`);
});
emitter.emit("login", "Ahmed");

// Q14
function readFileContentSync(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  console.log(`The file content => "${content}"`);
}
const notesFilePath = path.join(__dirname, "notes.txt");
if (!fs.existsSync(notesFilePath)) {
  fs.writeFileSync(notesFilePath, "This is a note.");
}
readFileContentSync(notesFilePath);

// Q15
function writeFileAsync(filePath, content) {
  fs.writeFile(filePath, content, "utf-8", (error) => {
    if (error) {
      console.log(`Failed to write file: ${error.message}`);
      return;
    }
    console.log("File written successfully.");
  });
}
const asyncFilePath = path.join(__dirname, "async.txt");
writeFileAsync(asyncFilePath, "Async save");

// Q16
function checkPathExists(targetPath) {
  return fs.existsSync(targetPath);
}
console.log(checkPathExists(notesFilePath));

// Q17
function getSystemInformation() {
  return {
    Platform: os.platform(),
    Arch: os.arch(),
  };
}
console.log(getSystemInformation());