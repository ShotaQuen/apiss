const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

// Import database
const db = require("./models/database");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "static")));

// Function to dynamically load routes and collect endpoint info
const loadRoutes = () => {
  const routesDir = path.join(__dirname, "routes");
  const apiRoutesDir = path.join(routesDir, "api");
  const categories = {};
  let totalEndpoints = 0;

  // Load user route separately as it's directly under /api
  const userRoutes = require(path.join(routesDir, "user.js"));
  app.use("/api", userRoutes);
  if (userRoutes.endpoints && userRoutes.description) {
    categories.User = {
      description: userRoutes.description,
      endpoints: userRoutes.endpoints.map(ep => ({
        path: `/api${ep.path}`,
        method: ep.method,
        params: ep.params || []
      }))
    };
    totalEndpoints += userRoutes.endpoints.length;
  }

  const apiRouteFiles = fs.readdirSync(apiRoutesDir).filter(file => file.endsWith(".js"));

  for (const file of apiRouteFiles) {
    const routeName = file.replace(".js", "");
    const routeModule = require(path.join(apiRoutesDir, file));
    
    // Register the route with Express with /api/:routeName prefix
    const urlPrefix = `/api/${routeName}`;
    app.use(urlPrefix, routeModule);

    // Collect endpoint information if available
    if (routeModule.endpoints && routeModule.description) {
      categories[routeName.charAt(0).toUpperCase() + routeName.slice(1)] = {
        description: routeModule.description,
        endpoints: routeModule.endpoints.map(ep => ({
          path: `${urlPrefix}${ep.path}`,
          method: ep.method,
          params: ep.params || []
        }))
      };
      totalEndpoints += routeModule.endpoints.length;
    }
  }
  return { categories, totalEndpoints };
};

const { categories, totalEndpoints } = loadRoutes();

// API Documentation endpoint
app.get("/api", (req, res) => {
  const apiEndpoints = {
    status: true,
    creator: "REST API Website",
    message: "Welcome to REST API Documentation",
    total_endpoints: totalEndpoints,
    categories: categories
  };
  res.json(apiEndpoints);
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
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
  });

module.exports = app;


