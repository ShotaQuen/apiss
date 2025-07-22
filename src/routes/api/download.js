const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET /youtube-mp3 - YouTube to MP3 Download API
// Example Request: { "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
// Example Response: { "status": true, "creator": "REST API Website", "result": { "title": "Sample Video Title", "duration": "3:45", "download_url": "https://example.com/download.mp3", "file_size": "5.2 MB" } }
router.get("/youtube-mp3", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        status: false,
        error: "URL parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        title: "Sample Video Title",
        duration: "3:45",
        download_url: "https://example.com/download.mp3",
        file_size: "5.2 MB"
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in youtube-mp3 API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /youtube-mp4 - YouTube to MP4 Download API
// Example Request: { "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "quality": "720p" }
// Example Response: { "status": true, "creator": "REST API Website", "result": { "title": "Sample Video Title", "duration": "3:45", "quality": "720p", "download_url": "https://example.com/download.mp4", "file_size": "25.8 MB" } }
router.get("/youtube-mp4", async (req, res) => {
  try {
    const { url, quality = "720p" } = req.query;

    if (!url) {
      return res.status(400).json({
        status: false,
        error: "URL parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        title: "Sample Video Title",
        duration: "3:45",
        quality: quality,
        download_url: "https://example.com/download.mp4",
        file_size: "25.8 MB"
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in youtube-mp4 API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /tiktok - TikTok Download API
// Example Request: { "url": "https://www.tiktok.com/@tiktok/video/7000000000000000000" }
// Example Response: { "status": true, "creator": "REST API Website", "result": { "title": "Sample TikTok Video", "author": "sample_user", "download_url": "https://example.com/tiktok-video.mp4", "thumbnail": "https://example.com/thumbnail.jpg" } }
router.get("/tiktok", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        status: false,
        error: "URL parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        title: "Sample TikTok Video",
        author: "sample_user",
        download_url: "https://example.com/tiktok-video.mp4",
        thumbnail: "https://example.com/thumbnail.jpg"
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in tiktok API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /facebook - Facebook Download API
// Example Request: { "url": "https://www.facebook.com/facebook/videos/1000000000000000/" }
// Example Response: { "status": true, "creator": "REST API Website", "result": { "title": "Sample Facebook Video", "download_url": "https://example.com/facebook-video.mp4", "file_size": "15.3 MB" } }
router.get("/facebook", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        status: false,
        error: "URL parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        title: "Sample Facebook Video",
        download_url: "https://example.com/facebook-video.mp4",
        file_size: "15.3 MB"
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in facebook API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /spotify - Spotify Download API
// Example Request: { "url": "https://open.spotify.com/track/1234567890" }
// Example Response: { "status": true, "creator": "REST API Website", "result": { "title": "Sample Song Title", "artist": "Sample Artist", "album": "Sample Album", "download_url": "https://example.com/spotify-song.mp3", "duration": "3:25" } }
router.get("/spotify", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        status: false,
        error: "URL parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        title: "Sample Song Title",
        artist: "Sample Artist",
        album: "Sample Album",
        download_url: "https://example.com/spotify-song.mp3",
        duration: "3:25"
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in spotify API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /mediafire - MediaFire Download API
// Example Request: { "url": "https://www.mediafire.com/file/abcdefg/sample.zip/file" }
// Example Response: { "status": true, "creator": "REST API Website", "result": { "filename": "sample-file.zip", "file_size": "45.7 MB", "download_url": "https://example.com/direct-download-link.zip" } }
router.get("/mediafire", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        status: false,
        error: "URL parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        filename: "sample-file.zip",
        file_size: "45.7 MB",
        download_url: "https://example.com/direct-download-link.zip"
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in mediafire API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

router.description = "Media download APIs";

module.exports = router;


