const express = require("express");
const router = express.Router();
const db = require("../models/database");

// GET /users - Get all users
// Example Request: {}
// Example Response: [ { "id": 1, "username": "john_doe", "email": "john@example.com" }, { "id": 2, "username": "jane_doe", "email": "jane@example.com" } ]
router.get("/users", async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({
      status: false,
      error: "Failed to retrieve users"
    });
  }
});

// POST /users - Create new user
// Example Request: { "username": "new_user", "email": "new@example.com" }
// Example Response: { "id": 3, "username": "new_user", "email": "new@example.com" }
router.post("/users", async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        status: false,
        error: "Username and email are required"
      });
    }

    const user = await db.createUser(username, email);
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.message.includes("UNIQUE constraint failed")) {
      res.status(400).json({
        status: false,
        error: "Username or email already exists"
      });
    } else {
      res.status(500).json({
        status: false,
        error: "Failed to create user"
      });
    }
  }
});

// GET /users/:id - Get user by ID
// Example Request: { "id": 1 }
// Example Response: { "id": 1, "username": "john_doe", "email": "john@example.com" }
router.get("/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await db.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        error: "User not found"
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({
      status: false,
      error: "Failed to retrieve user"
    });
  }
});

// PUT /users/:id - Update user
// Example Request: { "id": 1, "username": "updated_john", "email": "updated_john@example.com" }
// Example Response: { "id": 1, "username": "updated_john", "email": "updated_john@example.com" }
router.put("/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { username, email } = req.body;

    // Check if user exists
    const existingUser = await db.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({
        status: false,
        error: "User not found"
      });
    }

    // Use existing values if not provided
    const updatedUsername = username || existingUser.username;
    const updatedEmail = email || existingUser.email;

    const user = await db.updateUser(updatedUsername, updatedEmail, userId);
    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.message.includes("UNIQUE constraint failed")) {
      res.status(400).json({
        status: false,
        error: "Username or email already exists"
      });
    } else {
      res.status(500).json({
        status: false,
        error: "Failed to update user"
      });
    }
  }
});

// DELETE /users/:id - Delete user
// Example Request: { "id": 1 }
// Example Response: (No Content - 204 Status)
router.delete("/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Check if user exists
    const existingUser = await db.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({
        status: false,
        error: "User not found"
      });
    }

    await db.deleteUser(userId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      status: false,
      error: "Failed to delete user"
    });
  }
});

router.description = "User management APIs";

module.exports = router;


