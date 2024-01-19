const express = require("express");
const server = require("http");
const path = require("path");

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3000;

//for serving static files at public from root dir
app.use(express.static(path.join(__dirname, "client")));

// route for the root URL
app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "client", "index.html"));

  if (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log("listning...");
});
