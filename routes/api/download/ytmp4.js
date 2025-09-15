const express = require("express");
const router = express.Router();

// Contoh response bawaan untuk dokumentasi
router.example_response = "linkvideo";

/**
 * @route GET /api/download/ytmp4
 * @query url (string) - link YouTube
 */
router.get("/", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      status: false,
      message: "Missing parameter: url"
    });
  }

  try {
    // Dummy response (nanti bisa diganti ytdl-core atau API lain)
    res.json({
      status: true,
      title: "Contoh Judul Video",
      link: "https://example.com/download/video.mp4"
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to process request",
      error: err.message
    });
  }
});

module.exports = router;
