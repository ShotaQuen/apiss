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

  // Helper to extract parameters from route path
  const extractPathParams = (routePath) => {
    const params = [];
    const regex = /:([a-zA-Z0-9_]+)/g;
    let match;
    while ((match = regex.exec(routePath)) !== null) {
      params.push(match[1]);
    }
    return params;
  };

  // Process user route separately
  const userRoutes = require(path.join(routesDir, "user.js"));
  app.use("/api", userRoutes);
  
  const userEndpoints = [];
  userRoutes.stack.forEach(layer => {
    if (layer.route) {
      const routePath = layer.route.path;
      const methods = Object.keys(layer.route.methods);
      methods.forEach(method => {
        const fullPath = `/api${routePath}`;
        const pathParams = extractPathParams(routePath);
        // For query params, we'll need to manually inspect the handler or assume based on common patterns
        // For now, we'll just include path params and rely on the previous explicit params for query if available
        userEndpoints.push({
          path: fullPath,
          method: method.toUpperCase(),
          params: pathParams // Simplified: only path params are auto-detected
        });
      });
    }
  });
  categories.User = {
    description: "User management APIs", // Hardcoded description for user route
    endpoints: userEndpoints
  };
  totalEndpoints += userEndpoints.length;

  const apiRouteFiles = fs.readdirSync(apiRoutesDir).filter(file => file.endsWith(".js"));

  for (const file of apiRouteFiles) {
    const routeName = file.replace(".js", "");
    const routeModule = require(path.join(apiRoutesDir, file));
    
    const urlPrefix = `/api/${routeName}`;
    app.use(urlPrefix, routeModule);

    const moduleEndpoints = [];
    routeModule.stack.forEach(layer => {
      if (layer.route) {
        const routePath = layer.route.path;
        const methods = Object.keys(layer.route.methods);
        methods.forEach(method => {
          const fullPath = `${urlPrefix}${routePath}`;
          const pathParams = extractPathParams(routePath);
          moduleEndpoints.push({
            path: fullPath,
            method: method.toUpperCase(),
            params: pathParams // Simplified: only path params are auto-detected
          });
        });
      }
    });

    categories[routeName.charAt(0).toUpperCase() + routeName.slice(1)] = {
      description: routeModule.description || `APIs for ${routeName}`, // Use existing description or default
      endpoints: moduleEndpoints
    };
    totalEndpoints += moduleEndpoints.length;
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


