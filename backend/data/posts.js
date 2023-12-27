const fs = require("node:fs/promises");
const PATH = "../site/src/data";

async function getFileContent(fileName) {
  const rawFileContent = await fs.readFile(`${PATH}/${fileName}`, {
    encoding: "utf-8",
  });
  const data = JSON.parse(rawFileContent) || {};
  return data;
}

function checkFolder(folderName) {
  if (!fs.existsSync(`${PATH}/${folderName}`)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function saveFile(fileName, posts) {
  return fs.writeFile(
    `${PATH}/${fileName}`,
    JSON.stringify(posts || {}, null, 5),
    { flag: "w" }
  );
}

exports.saveFile = saveFile;
exports.checkFolder = checkFolder;
exports.getFileContent = getFileContent;
