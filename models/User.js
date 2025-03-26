const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: String,
  trackedWebsites: [{ type: mongoose.Schema.Types.ObjectId, ref: "WebsiteData" }]
});

module.exports = mongoose.model("User", UserSchema);
