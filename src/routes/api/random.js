const express = require("express");
const router = express.Router();

// GET /anime - Random Anime API
// Example Request: {}
// Example Response: { "status": true, "creator": "REST API Website", "result": { "title": "Jujutsu Kaisen", "genre": "Action, Dark Fantasy", "year": 2020, "rating": 8.7, "image": "https://example.com/jujutsu-kaisen.jpg" } }
router.get("/anime", async (req, res) => {
  try {
    const animeList = [
      {
        title: "Attack on Titan",
        genre: "Action, Drama",
        year: 2013,
        rating: 9.0,
        image: "https://example.com/aot.jpg"
      },
      {
        title: "One Piece",
        genre: "Adventure, Comedy",
        year: 1999,
        rating: 8.9,
        image: "https://example.com/onepiece.jpg"
      },
      {
        title: "Demon Slayer",
        genre: "Action, Supernatural",
        year: 2019,
        rating: 8.7,
        image: "https://example.com/demonslayer.jpg"
      },
      {
        title: "Jujutsu Kaisen",
        genre: "Action, Dark Fantasy",
        year: 2020,
        rating: 8.7,
        image: "https://example.com/jujutsu-kaisen.jpg"
      }
    ];

    const randomAnime = animeList[Math.floor(Math.random() * animeList.length)];

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: randomAnime
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in random anime API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /quotes - Random Quotes API
// Example Request: {}
// Example Response: { "status": true, "creator": "REST API Website", "result": { "text": "The only true wisdom is in knowing you know nothing.", "author": "Socrates", "category": "Philosophy" } }
router.get("/quotes", async (req, res) => {
  try {
    const quotes = [
      {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: "Motivation"
      },
      {
        text: "Life is what happens to you while you\"re busy making other plans.",
        author: "John Lennon",
        category: "Life"
      },
      {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
        category: "Dreams"
      },
      {
        text: "The only true wisdom is in knowing you know nothing.",
        author: "Socrates",
        category: "Philosophy"
      }
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: randomQuote
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in random quotes API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /blue-archive - Random Blue Archive Character API
// Example Request: {}
// Example Response: { "status": true, "creator": "REST API Website", "result": { "name": "Aris", "school": "Millennium Science School", "weapon": "Assault Rifle", "rarity": 3, "image": "https://example.com/aris.jpg" } }
router.get("/blue-archive", async (req, res) => {
  try {
    const characters = [
      {
        name: "Shiroko",
        school: "Abydos High School",
        weapon: "Assault Rifle",
        rarity: 3,
        image: "https://example.com/shiroko.jpg"
      },
      {
        name: "Hoshino",
        school: "Abydos High School",
        weapon: "Shotgun",
        rarity: 3,
        image: "https://example.com/hoshino.jpg"
      },
      {
        name: "Aru",
        school: "Gehenna Academy",
        weapon: "Submachine Gun",
        rarity: 3,
        image: "https://example.com/aru.jpg"
      },
      {
        name: "Aris",
        school: "Millennium Science School",
        weapon: "Assault Rifle",
        rarity: 3,
        image: "https://example.com/aris.jpg"
      }
    ];

    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: randomCharacter
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in random blue-archive API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

// GET /waifu - Random Waifu API
// Example Request: {}
// Example Response: { "status": true, "creator": "REST API Website", "result": { "name": "Asuna", "anime": "Sword Art Online", "image": "https://example.com/asuna.jpg", "description": "Vice-commander of the Knights of the Blood Oath" } }
router.get("/waifu", async (req, res) => {
  try {
    const waifus = [
      {
        name: "Rem",
        anime: "Re:Zero",
        image: "https://example.com/rem.jpg",
        description: "Blue-haired maid from Re:Zero"
      },
      {
        name: "Zero Two",
        anime: "Darling in the FranXX",
        image: "https://example.com/zerotwo.jpg",
        description: "Pink-haired pilot with horns"
      },
      {
        name: "Nezuko",
        anime: "Demon Slayer",
        image: "https://example.com/nezuko.jpg",
        description: "Demon girl who protects humans"
      },
      {
        name: "Asuna",
        anime: "Sword Art Online",
        image: "https://example.com/asuna.jpg",
        description: "Vice-commander of the Knights of the Blood Oath"
      }
    ];

    const randomWaifu = waifus[Math.floor(Math.random() * waifus.length)];

    const responseData = {
      status: true,
      creator: "REST API Website",
      result: randomWaifu
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in random waifu API:", error);
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

router.description = "Random content generators";

module.exports = router;


