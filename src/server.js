// Imports
require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const CONFIG = require("../config.js");
const Videos_MIME_Mapper = CONFIG.VIDEO_MIME_TYPES_MAPPING || {};

// Initializing the app
const app = express();

// Static middleware
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
});

app.get("/list-videos", (req, res) => {
  const filenames = fs.readdirSync(CONFIG.VIDEO_DIRECTORY);

  const output = [];
  filenames.forEach((file) => {
    const match = file.match(/.+\.(\w+?)$/);
    if (
      match &&
      match.length >= 2 &&
      Videos_MIME_Mapper.hasOwnProperty(match[1])
    ) {
      output.push({
        file,
        extn: match[1],
        mime: Videos_MIME_Mapper[match[1]],
      });
    }
  });

  res.status(200).send({
    status: "success",
    data: output,
  });
});

app.get("/video/:filename", (req, res) => {
  const { filename } = req.params;
  const range = req.headers.range;
  if (!range) {
    res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
    return;
  }

  const videoPath = CONFIG.VIDEO_DIRECTORY + "/" + filename;
  const videoSize = fs.statSync(videoPath).size;

  // get mime type
  let mime__type = "video/mp4";
  const match = filename.match(/.+\.(\w+?)$/);
  if (match && match.length >= 2) {
    mime__type = Videos_MIME_Mapper[match[1]];
  }

  // Parse Range
  // Example: "bytes=3232-"
  const CHUNK_SIZE = CONFIG.VIDEO_STREAM_CHUNK_SIZE; // 1 MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(videoSize - 1, start + CHUNK_SIZE);

  // Create headers
  const headers = {
    "Content-Type": mime__type,
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": end - start + 1,
  };

  // HTTP Status 206 for partial content
  res.writeHead(206, headers);

  // create a video stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

// Spinning up the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Yay! Server running on PORT: ${PORT}`);
});
