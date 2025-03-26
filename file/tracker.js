const express = require("express");
const WebsiteData = require("../models/WebsiteData");

const router = express.Router();

router.post("/track", async (req, res) => {
  const { url, timeSpent, category } = req.body;

  let website = await WebsiteData.findOne({ url });
  if (website) {
    website.timeSpent += timeSpent;
  } else {
    website = new WebsiteData({ url, timeSpent, category });
  }

  await website.save();
  res.status(200).json({ success: true, website });
});

router.get("/stats", async (req, res) => {
  const data = await WebsiteData.find();
  res.status(200).json(data);
});

module.exports = router;
