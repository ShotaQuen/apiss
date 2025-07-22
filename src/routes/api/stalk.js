const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET /mobile-legends - Mobile Legends Profile API
router.get("/mobile-legends", async (req, res) => {
  try {
    const { id, zone } = req.query;

    if (!id || !zone) {
      return res.status(400).json({
        status: false,
        error: "ID and Zone parameters are required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        player_id: id,
        zone: zone,
        username: "SamplePlayer",
        level: 45,
        rank: "Epic III",
        total_matches: 1250,
        win_rate: "65.2%",
        favorite_hero: "Layla"
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in mobile-legends stalk API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /genshin-impact - Genshin Impact Profile API
router.get("/genshin-impact", async (req, res) => {
  try {
    const { uid } = req.query;

    if (!uid) {
      return res.status(400).json({
        status: false,
        error: "UID parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        uid: uid,
        nickname: "Traveler",
        adventure_rank: 55,
        world_level: 8,
        abyss_floor: "12-3",
        characters_count: 25,
        achievements: 450,
        signature: "Exploring Teyvat!"
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in genshin-impact stalk API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /free-fire - Free Fire Profile API
router.get("/free-fire", async (req, res) => {
  try {
    const { uid } = req.query;

    if (!uid) {
      return res.status(400).json({
        status: false,
        error: "UID parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        uid: uid,
        nickname: "FirePlayer",
        level: 60,
        rank: "Heroic",
        total_matches: 2500,
        win_rate: "58.4%",
        k_d_ratio: "2.1",
        guild: "SampleGuild"
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in free-fire stalk API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /npm - NPM Package Information API
router.get("/npm", async (req, res) => {
  try {
    const { package: packageName } = req.query;

    if (!packageName) {
      return res.status(400).json({
        status: false,
        error: "Package parameter is required"
      });
    }

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: {
        name: packageName,
        version: "1.0.0",
        description: "Sample package description",
        author: "Sample Author",
        license: "MIT",
        weekly_downloads: "50,000",
        last_publish: new Date().toISOString(),
        repository: `https://github.com/sample/${packageName}`,
        homepage: `https://npmjs.com/package/${packageName}`
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in npm stalk API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

router.description = "Account and profile information";

module.exports = router;


