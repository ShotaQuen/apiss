const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET /youtube - YouTube Search API
// Example Request: { "query": "nodejs tutorial", "limit": 3 }
// Example Response: { "status": true, "creator": "REST API Website", "result": { "query": "nodejs tutorial", "limit": 3, "videos": [ { "title": "Node.js Tutorial for Beginners", "channel": "Academind", "duration": "1:30:00", "views": "5M views", "url": "https://youtube.com/watch?v=someid1" }, { "title": "Learn Node.js in 10 Minutes", "channel": "Web Dev Simplified", "duration": "0:10:00", "views": "1.2M views", "url": "https://youtube.com/watch?v=someid2" } ] } }
router.get("/youtube", async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        status: false,
        error: "Query parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        query: query,
        limit: parseInt(limit),
        videos: [
          {
            title: "Node.js Tutorial for Beginners",
            channel: "Academind",
            duration: "1:30:00",
            views: "5M views",
            url: "https://youtube.com/watch?v=someid1"
          },
          {
            title: "Learn Node.js in 10 Minutes",
            channel: "Web Dev Simplified",
            duration: "0:10:00",
            views: "1.2M views",
            url: "https://youtube.com/watch?v=someid2"
          }
        ]
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in youtube search API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /tiktok - TikTok Search API
// Example Request: { "query": "funny cats", "limit": 3 }
// Example Response: { "status": true, "creator": "REST API Website", "result": { "query": "funny cats", "limit": 3, "videos": [ { "title": "Cutest Cat Compilation", "author": "@catlover", "likes": "1.5M", "url": "https://tiktok.com/@catlover/video/someid1" }, { "title": "Cats Doing Funny Things", "author": "@funnyanimals", "likes": "800K", "url": "https://tiktok.com/@funnyanimals/video/someid2" } ] } }
router.get("/tiktok", async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        status: false,
        error: "Query parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        query: query,
        limit: parseInt(limit),
        videos: [
          {
            title: "Cutest Cat Compilation",
            author: "@catlover",
            likes: "1.5M",
            url: "https://tiktok.com/@catlover/video/someid1"
          },
          {
            title: "Cats Doing Funny Things",
            author: "@funnyanimals",
            likes: "800K",
            url: "https://tiktok.com/@funnyanimals/video/someid2"
          }
        ]
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in tiktok search API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /pinterest - Pinterest Search API
// Example Request: { "query": "minimalist living room", "limit": 3 }
// Example Response: { "status": true, "creator": "REST API Website", "result": { "query": "minimalist living room", "limit": 3, "pins": [ { "title": "Minimalist Living Room Ideas", "image_url": "https://example.com/pin1.jpg", "board": "Home Decor", "url": "https://pinterest.com/pin/someid1" }, { "title": "Scandinavian Minimalist Design", "image_url": "https://example.com/pin2.jpg", "board": "Interior Design", "url": "https://pinterest.com/pin/someid2" } ] } }
router.get("/pinterest", async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        status: false,
        error: "Query parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        query: query,
        limit: parseInt(limit),
        pins: [
          {
            title: "Minimalist Living Room Ideas",
            image_url: "https://example.com/pin1.jpg",
            board: "Home Decor",
            url: "https://pinterest.com/pin/someid1"
          },
          {
            title: "Scandinavian Minimalist Design",
            image_url: "https://example.com/pin2.jpg",
            board: "Interior Design",
            url: "https://pinterest.com/pin/someid2"
          }
        ]
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in pinterest search API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /news - News Search API
// Example Request: { "query": "artificial intelligence", "limit": 3 }
// Example Response: { "status": true, "creator": "REST API Website", "result": { "query": "artificial intelligence", "limit": 3, "articles": [ { "title": "AI Breakthrough in Medical Diagnosis", "source": "Tech News Daily", "published_at": "2025-07-22T10:00:00Z", "url": "https://example.com/news1" }, { "title": "The Future of AI in Robotics", "source": "Science Today", "published_at": "2025-07-21T15:30:00Z", "url": "https://example.com/news2" } ] } }
router.get("/news", async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        status: false,
        error: "Query parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        query: query,
        limit: parseInt(limit),
        articles: [
          {
            title: "AI Breakthrough in Medical Diagnosis",
            source: "Tech News Daily",
            published_at: "2025-07-22T10:00:00Z",
            url: "https://example.com/news1"
          },
          {
            title: "The Future of AI in Robotics",
            source: "Science Today",
            published_at: "2025-07-21T15:30:00Z",
            url: "https://example.com/news2"
          }
        ]
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in news search API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /capcut - CapCut Search API
// Example Request: { "query": "travel vlog template", "limit": 3 }
// Example Response: { "status": true, "creator": "REST API Website", "result": { "query": "travel vlog template", "limit": 3, "templates": [ { "title": "Travel Vlog Intro", "creator": "VlogMaster", "uses": "500K", "url": "https://capcut.com/template/someid1" }, { "title": "Adventure Travel Edit", "creator": "ExploreCreator", "uses": "200K", "url": "https://capcut.com/template/someid2" } ] } }
router.get("/capcut", async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({
        status: false,
        error: "Query parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        query: query,
        limit: parseInt(limit),
        templates: [
          {
            title: "Travel Vlog Intro",
            creator: "VlogMaster",
            uses: "500K",
            url: "https://capcut.com/template/someid1"
          },
          {
            title: "Adventure Travel Edit",
            creator: "ExploreCreator",
            uses: "200K",
            url: "https://capcut.com/template/someid2"
          }
        ]
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in capcut search API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

router.description = "Search engines and content discovery";

module.exports = router;


