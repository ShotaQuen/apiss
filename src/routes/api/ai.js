const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET /hydromind - AI Hydromind Chat API
router.get("/hydromind", async (req, res) => {
  try {
    const { text, model } = req.query;

    if (!text || !model) {
      return res.status(400).json({
        status: false,
        error: "Text and Model parameters are required"
      });
    }

    // Simulate API call (replace with actual implementation)
    const responseData = {
      status: true,
      creator: "REST API Website",
      result: `AI Response for: ${text} using model: ${model}`
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in hydromind API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /ai-img - AI Image Generation API
router.get("/ai-img", async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({
        status: false,
        error: "Prompt parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        prompt: prompt,
        image_url: "https://example.com/generated-image.jpg"
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in ai-img API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /luminai - AI Luminai API
router.get("/luminai", async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({
        status: false,
        error: "Text parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: `Luminai response for: ${text}`
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in luminai API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /openai - OpenAI Chat API
router.get("/openai", async (req, res) => {
  try {
    const { text, model = "gpt-3.5-turbo" } = req.query;

    if (!text) {
      return res.status(400).json({
        status: false,
        error: "Text parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: `OpenAI ${model} response for: ${text}`
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in openai API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /textoimage - Text to Image API
router.get("/textoimage", async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({
        status: false,
        error: "Text parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        text: text,
        image_url: "https://example.com/text-to-image.jpg"
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in textoimage API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

router.description = "Artificial Intelligence related APIs";
router.endpoints = [
  { path: "/hydromind", method: "GET", params: ["text", "model"] },
  { path: "/ai-img", method: "GET", params: ["prompt"] },
  { path: "/luminai", method: "GET", params: ["text"] },
  { path: "/openai", method: "GET", params: ["text", "model"] },
  { path: "/textoimage", method: "GET", params: ["text"] }
];

module.exports = router;


