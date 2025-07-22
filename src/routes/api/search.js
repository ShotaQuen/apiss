const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET /youtube - YouTube Search API
// Example Request: { "query": "nodejs tutorial", "limit": 5 }
// Example Response: { "status": true, "creator": "REST API Website", "result": { "query": "nodejs tutorial", "limit": 5, "videos": [ { "title": "Sample Video 1 for nodejs tutorial", "channel": "Sample Channel 1", "duration": "3:45", "views": "1.2M views", "url": "https://youtube.com/watch?v=sample1" } ] } }
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
        videos: Array.from({ length: Math.min(parseInt(limit), 5) }, (_, i) => ({
          title: `Sample Video ${i + 1} for ${query}`,
          channel: `Sample Channel ${i + 1}`,
          duration: "3:45",
          views: "1.2M views",
          url: `https://youtube.com/watch?v=sample${i + 1}`
        }))
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
// Example Request: { "query": "funny cats", "limit": 5 }
// Example Response: { "status": true, "creator": "REST API Website", "result": { "query": "funny cats", "limit": 5, "videos": [ { "title": "Sample TikTok 1 for funny cats", "author": "@user1", "likes": "50K", "url": "https://tiktok.com/@user1/video/sample1" } ] } }
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
        videos: Array.from({ length: Math.min(parseInt(limit), 5) }, (_, i) => ({
          title: `Sample TikTok ${i + 1} for ${query}`,
          author: `@user${i + 1}`,
          likes: `${Math.floor(Math.random() * 100)}K`,
          url: `https://tiktok.com/@user${i + 1}/video/sample${i + 1}`
        }))
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
// Example Request: { "query": "minimalist design", "limit": 5 }
// Example Response: { "status": true, "creator": "REST API Website", "result": { "query": "minimalist design", "limit": 5, "pins": [ { "title": "Sample Pin 1 for minimalist design", "image_url": "https://example.com/pin1.jpg", "board": "Sample Board 1", "url": "https://pinterest.com/pin/sample1" } ] } }
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
        pins: Array.from({ length: Math.min(parseInt(limit), 5) }, (_, i) => ({
          title: `Sample Pin ${i + 1} for ${query}`,
          image_url: `https://example.com/pin${i + 1}.jpg`,
          board: `Sample Board ${i + 1}`,
          url: `https://pinterest.com/pin/sample${i + 1}`
        }))
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
// Example Request: { "query": "technology news", "limit": 5 }
// Example Response: { "status": true, "creator": "REST API Website", "result": { "query": "technology news", "limit": 5, "articles": [ { "title": "Sample News 1 about technology news", "source": "News Source 1", "published_at": "2025-07-22T00:00:00.000Z", "url": "https://example.com/news1" } ] } }
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
        articles: Array.from({ length: Math.min(parseInt(limit), 5) }, (_, i) => ({
          title: `Sample News ${i + 1} about ${query}`,
          source: `News Source ${i + 1}`,
          published_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          url: `https://example.com/news${i + 1}`
        }))
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
// Example Request: { "query": "capcut template aesthetic", "limit": 5 }
// Example Response: { "status": true, "creator": "REST API Website", "result": { "query": "capcut template aesthetic", "limit": 5, "templates": [ { "title": "Sample Template 1 for capcut template aesthetic", "creator": "Creator 1", "uses": "100K", "url": "https://capcut.com/template/sample1" } ] } }
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
        templates: Array.from({ length: Math.min(parseInt(limit), 5) }, (_, i) => ({
          title: `Sample Template ${i + 1} for ${query}`,
          creator: `Creator ${i + 1}`,
          uses: `${Math.floor(Math.random() * 1000)}K`,
          url: `https://capcut.com/template/sample${i + 1}`
        }))
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


