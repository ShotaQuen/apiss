const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET /screenshot - Website Screenshot API
router.get("/screenshot", async (req, res) => {
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
        url: url,
        screenshot_url: "https://example.com/screenshot.png",
        timestamp: new Date().toISOString()
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in screenshot API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /tinyurl - URL Shortener API
router.get("/tinyurl", async (req, res) => {
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
        original_url: url,
        short_url: "https://tinyurl.com/sample123",
        created_at: new Date().toISOString()
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in tinyurl API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /tempmail - Temporary Email API
router.get("/tempmail", async (req, res) => {
  try {
    const { action = "generate" } = req.query;

    let responseData;

    if (action === "generate") {
      responseData = {
        status: true,
        creator: "REST API Website",
        result: {
          email: "temp123@tempmail.com",
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
      };
    } else if (action === "inbox") {
      responseData = {
        status: true,
        creator: "REST API Website",
        result: {
          messages: [
            {
              from: "example@test.com",
              subject: "Sample Email",
              received_at: new Date().toISOString()
            }
          ]
        }
      };
    } else {
      return res.status(400).json({
        status: false,
        error: "Invalid action. Use \"generate\" or \"inbox\""
      });
    }

    res.json(responseData);
  } catch (error) {
    console.error("Error in tempmail API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /email-checker - Email Validation API
router.get("/email-checker", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        status: false,
        error: "Email parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        email: email,
        valid: true,
        disposable: false,
        domain: email.split("@")[1]
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in email-checker API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /text-to-speech - Text to Speech API
router.get("/text-to-speech", async (req, res) => {
  try {
    const { text, lang = "en" } = req.query;

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
        language: lang,
        audio_url: "https://example.com/tts-audio.mp3"
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in text-to-speech API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /earthquake-info - Earthquake Information API
router.get("/earthquake-info", async (req, res) => {
  try {
    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        latest_earthquake: {
          magnitude: "5.2",
          location: "Sample Location",
          depth: "10 km",
          time: new Date().toISOString()
        }
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in earthquake-info API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /vcc-generator - Virtual Credit Card Generator API
router.get("/vcc-generator", async (req, res) => {
  try {
    const { type = "visa" } = req.query;

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        card_number: "4111 1111 1111 1111",
        card_type: type,
        expiry: "12/25",
        cvv: "123",
        note: "This is a sample card for testing purposes only"
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in vcc-generator API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

router.description = "Utility tools and services";

module.exports = router;


