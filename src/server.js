// Imports
require("dotenv").config();
const express = require("express");
const path = require("path");

// Initializing the app
const app = express();

// Static middleware
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
});

// Spinning up the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Yay! Server running on PORT: ${PORT}`);
});
