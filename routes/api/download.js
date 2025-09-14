const express = require("express");
const axios = require("axios");
const router = express.Router();
const { ytmp4, ytmp3 } = require('../../scrape/ytdl.js')

router.get("/ytmp3", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        status: false,
        error: "URL parameter is required"
      });
    }

    const result = await ytmp3(url);

    if (!result.success) {
      return res.status(500).json({
        status: false,
        error: result.error
      });
    }

    res.json({
      status: true,
      creator: "BerakNews",
      result: {
        result
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      error: error
    });
  }
});

router.description = "Mendownload Link Dari Berbagai Sosial Media";

module.exports = router;