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
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "static")));

// Fungsi untuk ambil query parameter dari code route
const extractQueryParams = (handlerCode) => {
  const params = new Set();

  // Pattern 1: const { param } = req.query
  const destructuringPattern = /const\s*{\s*([^}]+)\s*}\s*=\s*req\.query/g;
  let match;
  while ((match = destructuringPattern.exec(handlerCode)) !== null) {
    const paramString = match[1];
    const paramNames = paramString.split(",").map((p) => {
      const cleanParam = p.split("=")[0].trim();
      return cleanParam;
    });
    paramNames.forEach((param) => params.add(param));
  }

  // Pattern 2: req.query.paramName
  const directAccessPattern = /req\.query\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  while ((match = directAccessPattern.exec(handlerCode)) !== null) {
    params.add(match[1]);
  }

  return Array.from(params);
};

// Fungsi untuk load semua route dalam folder routes/api
const loadRoutes = () => {
  const apiRoutesDir = path.join(__dirname, "routes", "api");
  const categories = {};
  let totalEndpoints = 0;

  // Helper ambil parameter dari path
  const extractPathParams = (routePath) => {
    const params = [];
    const regex = /:([a-zA-Z0-9_]+)/g;
    let match;
    while ((match = regex.exec(routePath)) !== null) {
      params.push(match[1]);
    }
    return params;
  };

  // Baca semua file route
  const apiRouteFiles = fs.readdirSync(apiRoutesDir).filter(file => file.endsWith(".js"));

  for (const file of apiRouteFiles) {
    const routeName = file.replace(".js", "");
    const routeModule = require(path.join(apiRoutesDir, file));

    const urlPrefix = `/${routeName}`;
    app.use(urlPrefix, routeModule);

    const fileContent = fs.readFileSync(path.join(apiRoutesDir, file), "utf8");

    const moduleEndpoints = [];
    routeModule.stack.forEach(layer => {
      if (layer.route) {
        const routePath = layer.route.path;
        const methods = Object.keys(layer.route.methods);
        methods.forEach(method => {
          const fullPath = `${urlPrefix}${routePath}`;
          const pathParams = extractPathParams(routePath);

          // Ambil query param
          const queryParams = extractQueryParams(fileContent);

          // Cari contoh request & response dari komentar
          let exampleRequest = {};
          let exampleResponse = {};

          const routeIndex = fileContent.indexOf(`router.${method}("${routePath}"`);
          if (routeIndex !== -1) {
            const beforeRoute = fileContent.substring(Math.max(0, routeIndex - 500), routeIndex);
            const reqMatch = beforeRoute.match(/\/\/ Example Request: ([^\n]+)/);
            const resMatch = beforeRoute.match(/\/\/ Example Response: ([^\n]+)/);

            if (reqMatch) {
              try { exampleRequest = JSON.parse(reqMatch[1].trim()); } catch (e) {}
            }
            if (resMatch) {
              try { exampleResponse = JSON.parse(resMatch[1].trim()); } catch (e) {}
            }
          }

          moduleEndpoints.push({
            path: fullPath,
            method: method.toUpperCase(),
            params: [...pathParams, ...queryParams]
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

// Endpoint dokumentasi API
app.get("/api", (req, res) => {
  res.json({
    status: true,
    creator: "REST API Website",
    message: "Welcome to REST API Documentation",
    total_endpoints: totalEndpoints,
    categories: categories
  });
});

// SPA support
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

// Start server setelah DB siap
db.initialize()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
  });

module.exports = app;
