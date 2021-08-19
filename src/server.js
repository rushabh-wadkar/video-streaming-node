// Imports
require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const CONFIG = require("../config.js");

// Initializing the app
const app = express();

// Static middleware
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
});

app.get("/video", (req, res) => {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires range in headers");
  }

  const videoPath = CONFIG.VIDEO_DIRECTORY + "/sample.mp4";
  const videoSize = fs.statSync(videoPath).size;

  // Parse Range
  // Example: "bytes=3232-"
  const CHUNK_SIZE = CONFIG.VIDEO_STREAM_CHUNK_SIZE; // 1 MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(videoSize - 1, start + CHUNK_SIZE);

  // Create headers
  const headers = {
    "Content-Type": "video/mp4",
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
