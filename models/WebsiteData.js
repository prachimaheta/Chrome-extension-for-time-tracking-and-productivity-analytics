const mongoose = require("mongoose");

const WebsiteDataSchema = new mongoose.Schema({
  url: String,
  timeSpent: Number, // Time in seconds
  category: { type: String, enum: ["productive", "unproductive"] },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("WebsiteData", WebsiteDataSchema);
