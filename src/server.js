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

// Function to extract query parameters from route handler code
const extractQueryParams = (handlerCode) => {
  const params = new Set();
  
  // Pattern 1: const { param1, param2 } = req.query;
  const destructuringPattern = /const\s*{\s*([^}]+)\s*}\s*=\s*req\.query/g;
  let match;
  while ((match = destructuringPattern.exec(handlerCode)) !== null) {
    const paramString = match[1];
    const paramNames = paramString.split(',').map(p => {
      // Handle default values like "param = defaultValue"
      const cleanParam = p.split('=')[0].trim();
      return cleanParam;
    });
    paramNames.forEach(param => params.add(param));
  }
  
  // Pattern 2: req.query.paramName
  const directAccessPattern = /req\.query\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  while ((match = directAccessPattern.exec(handlerCode)) !== null) {
    params.add(match[1]);
  }
  
  return Array.from(params);
};

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
        
        // For user routes, we'll manually define common params since it's a special case
        let queryParams = [];
        if (method === 'post' && routePath === '/users') {
          queryParams = ['username', 'email'];
        } else if (method === 'put' && routePath === '/users/:id') {
          queryParams = ['username', 'email'];
        }
        
        userEndpoints.push({
          path: fullPath,
          method: method.toUpperCase(),
          params: [...pathParams, ...queryParams],
          exampleRequest: {},
          exampleResponse: {}
        });
      });
    }
  });
  categories.User = {
    description: "User management APIs",
    endpoints: userEndpoints
  };
  totalEndpoints += userEndpoints.length;

  const apiRouteFiles = fs.readdirSync(apiRoutesDir).filter(file => file.endsWith(".js"));

  for (const file of apiRouteFiles) {
    const routeName = file.replace(".js", "");
    const routeModule = require(path.join(apiRoutesDir, file));
    
    const urlPrefix = `/api/${routeName}`;
    app.use(urlPrefix, routeModule);

    // Read the file content to analyze query parameters and examples
    const fileContent = fs.readFileSync(path.join(apiRoutesDir, file), "utf8");

    const moduleEndpoints = [];
    routeModule.stack.forEach(layer => {
      if (layer.route) {
        const routePath = layer.route.path;
        const methods = Object.keys(layer.route.methods);
        methods.forEach(method => {
          const fullPath = `${urlPrefix}${routePath}`;
          const pathParams = extractPathParams(routePath);
          
          // Extract query parameters from the entire file content
          const queryParams = extractQueryParams(fileContent);
          
          // Try to extract example request and response from comments
          let exampleRequest = {};
          let exampleResponse = {};
          
          // Look for example comments near the route definition
          const routeIndex = fileContent.indexOf(`router.${method}("${routePath}"`);
          if (routeIndex !== -1) {
            const beforeRoute = fileContent.substring(Math.max(0, routeIndex - 500), routeIndex);
            const reqMatch = beforeRoute.match(/\/\/ Example Request: ([^\n]+)/);
            const resMatch = beforeRoute.match(/\/\/ Example Response: ([^\n]+)/);
            
            if (reqMatch) {
              try {
                exampleRequest = JSON.parse(reqMatch[1].trim());
              } catch (e) { /* ignore */ }
            }
            if (resMatch) {
              try {
                exampleResponse = JSON.parse(resMatch[1].trim());
              } catch (e) { /* ignore */ }
            }
          }
          
          moduleEndpoints.push({
            path: fullPath,
            method: method.toUpperCase(),
            params: [...pathParams, ...queryParams],
            exampleRequest: exampleRequest,
            exampleResponse: exampleResponse
          });
        });
      }
    });

    categories[routeName.charAt(0).toUpperCase() + routeName.slice(1)] = {
      description: routeModule.description || `APIs for ${routeName}`,
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

