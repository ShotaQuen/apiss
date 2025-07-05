const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

// Import database
const db = require("./models/database");

// Import the new route analyzer
const RouteAnalyzer = require("./utils/routeAnalyzer");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "static")));

// Initialize route analyzer
const routeAnalyzer = new RouteAnalyzer();

// Function to dynamically load routes with automatic analysis
const loadRoutes = () => {
  const routesDir = path.join(__dirname, "routes");
  const apiRoutesDir = path.join(routesDir, "api");

  // Load user route separately as it's directly under /api
  const userRoutePath = path.join(routesDir, "user.js");
  if (fs.existsSync(userRoutePath)) {
    const userRoutes = require(userRoutePath);
    app.use("/api", userRoutes);
  }

  // Load all API routes
  if (fs.existsSync(apiRoutesDir)) {
    const apiRouteFiles = fs.readdirSync(apiRoutesDir).filter(file => file.endsWith(".js"));

    for (const file of apiRouteFiles) {
      const routeName = file.replace(".js", "");
      const routeModule = require(path.join(apiRoutesDir, file));
      
      // Register the route with Express with /api/:routeName prefix
      const urlPrefix = `/api/${routeName}`;
      app.use(urlPrefix, routeModule);
    }
  }

  // Analyze all routes automatically
  const analysisResult = routeAnalyzer.analyzeAllRoutes(routesDir);
  return analysisResult;
};

// Load routes and get analysis
const { categories, totalEndpoints } = loadRoutes();

// API Documentation endpoint with automatic analysis
app.get("/api", (req, res) => {
  // Get fresh analysis each time to ensure up-to-date information
  const routesDir = path.join(__dirname, "routes");
  const freshAnalysis = routeAnalyzer.analyzeAllRoutes(routesDir);
  
  const apiEndpoints = {
    status: true,
    creator: "REST API Website",
    message: "Welcome to REST API Documentation - Automatically Generated",
    total_endpoints: freshAnalysis.totalEndpoints,
    categories: freshAnalysis.categories,
    last_updated: new Date().toISOString(),
    auto_generated: true
  };
  res.json(apiEndpoints);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Route analysis endpoint for debugging
app.get("/api/debug/routes", (req, res) => {
  const routesDir = path.join(__dirname, "routes");
  const analysis = routeAnalyzer.analyzeAllRoutes(routesDir);
  
  res.json({
    status: true,
    message: "Route analysis debug information",
    analysis: analysis,
    analyzer_info: {
      patterns_used: Object.keys(routeAnalyzer.routePatterns),
      analysis_timestamp: new Date().toISOString()
    }
  });
});

// Serve frontend for all other routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

// Initialize database and start server
db.initialize()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on http://0.0.0.0:${PORT}`);
      console.log(`API Documentation available at: http://0.0.0.0:${PORT}/api`);
      console.log(`Total endpoints automatically detected: ${totalEndpoints}`);
      console.log("Route analysis is fully automatic - no manual endpoint definitions required!");
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
  });

module.exports = app;

