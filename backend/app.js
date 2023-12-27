const express = require("express");
const bodyParser = require("body-parser");
const { getFileContent, saveFile, checkFolder } = require("./data/posts");

const cors = require("cors");
const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => {
  // Attach CORS headers
  // Required when using a detached backend (that runs on a different domain)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/save", async (req, res) => {
  const requestBody = req.body;
  await saveFile(requestBody.name, requestBody.json);
  res.status(201).json({ message: "File has been saved" });
});

app.get("/data/:folder/:name", async (req, res) => {
  try {
    if (!req.params.folder) {
      res.json({ error: "folder doesn't exist" });
      return;
    }
    //checkFolder(req.params.folder);
    const storedPosts =
      (await getFileContent(`${req.params.folder}/${req.params.name}`)) || {};
    res.json(storedPosts);
  } catch (e) {
    // await saveFile(`${req.params.folder}/${req.params.name}`, {});
    res.json({ error: e });
  }
});

app.listen(8080);
