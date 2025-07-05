// ai.js
const express = require("express");
const { collectEndpoints } = require("../utils");

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

// Mengumpulkan endpoint secara otomatis
router.endpoints = collectEndpoints(router);

router.description = "Artificial Intelligence related APIs";

module.exports = router;
