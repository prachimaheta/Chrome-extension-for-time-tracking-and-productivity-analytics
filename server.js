const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/timeTracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const trackerRoutes = require("./file/tracker");
app.use("/api", trackerRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
