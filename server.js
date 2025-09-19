const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
require('./settings/module.js');
const app = express();

const db = require("./models/database");
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "static")));

// === Helper untuk parsing parameter dari kode route ===
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

// === Loader otomatis untuk routes ===
const loadRoutes = () => {
  const apiRoutesDir = path.join(__dirname, "routes", "api");
  const categories = {};
  let totalEndpoints = 0;

  const extractPathParams = (routePath) => {
    const params = [];
    const regex = /:([a-zA-Z0-9_]+)/g;
    let match;
    while ((match = regex.exec(routePath)) !== null) {
      params.push(match[1]);
    }
    return params;
  };

  // Baca semua file .js dalam folder routes/api (rekursif)
  const readFilesRecursive = (dir) => {
    const files = fs.readdirSync(dir);
    let result = [];
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        result = result.concat(readFilesRecursive(fullPath));
      } else if (file.endsWith(".js")) {
        result.push(fullPath);
      }
    }
    return result;
  };

  const apiRouteFiles = readFilesRecursive(apiRoutesDir);

  for (const file of apiRouteFiles) {
  const relativePath = path.relative(apiRoutesDir, file).replace(/\\/g, "/");
  const routeName = relativePath.replace(".js", "");

  // Ambil nama kategori dari folder paling atas (contoh: "download")
  const categoryName = routeName.split("/")[0];

  const routeModule = require(file);

  // Prefix hanya berdasarkan folder (contoh: /download)
  const urlPrefix = "/" + categoryName; 
  app.use(urlPrefix, routeModule);

  const fileContent = fs.readFileSync(file, "utf8");

  const moduleEndpoints = [];
  routeModule.stack.forEach(layer => {
    if (layer.route) {
      const routePath = layer.route.path; // contoh: /ytmp3
      const methods = Object.keys(layer.route.methods);

      methods.forEach(method => {
        const fullPath = `${urlPrefix}${routePath}`; // hasil: /download/ytmp3
        const pathParams = extractPathParams(routePath);
        const queryParams = extractQueryParams(fileContent);

        moduleEndpoints.push({
  path: fullPath,
  method: method.toUpperCase(),
  example_response: routeModule.example_response || null,
  params: [...pathParams, ...queryParams]
});

      });
    }
  });

  // Tambahkan endpoint ke kategori yang sama (pastikan tidak duplikat)
const categoryKey = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

if (!categories[categoryKey]) {
  categories[categoryKey] = {
    description: `APIs for ${categoryName}`,
    endpoints: [],
  };
}

moduleEndpoints.forEach(ep => {
  const alreadyExists = categories[categoryKey].endpoints.some(
    e => e.path === ep.path && e.method === ep.method
  );
  if (!alreadyExists) {
    categories[categoryKey].endpoints.push(ep);
    totalEndpoints++;
  }
});

  totalEndpoints += moduleEndpoints.length;
}

  return { categories, totalEndpoints };
};

const { categories, totalEndpoints } = loadRoutes();

// === Endpoint Dokumentasi API ===
app.get("/api", (req, res) => {
  res.json({
    status: true,
    creator: "REST API Website",
    message: "Welcome to REST API Documentation",
    total_endpoints: totalEndpoints,
    categories: categories
  });
});

app.get("/api/check", async (req, res) => {
  const apiUrl = "https://berak-new-pjq3.vercel.app/api"; // pakai API utama

  let apiDoc = {
    status: true,
    creator: "REST API Website",
    message: "Welcome to REST API Documentation",
    total_endpoints: 0,
    categories: {}
  };

  try {
    const response = await axios.get(apiUrl, { timeout: 5000 });
    const data = response.data;

    let totalEndpoints = 0;
    let categories = {};

    // Loop kategori
    for (const [categoryName, category] of Object.entries(data.categories)) {
      const endpointsArr = [];

      if (category.endpoints && category.endpoints.length > 0) {
        for (const endpoint of category.endpoints) {
          totalEndpoints++;

          // Bangun URL test dengan params
          let urlRest = `https://berak-new-pjq3.vercel.app${endpoint.path}`;
          if (endpoint.params && endpoint.params.length > 0) {
            const queryParams = endpoint.params.map((param, idx) => {
              if (param === "url") return `${param}=${encodeURIComponent(endpoint.example_response)}`;
              return `${param}=test${idx}`;
            }).join("&");
            urlRest += `?${queryParams}`;
          }

          // Default endpoint data
          const epData = {
            path: endpoint.path,
            method: endpoint.method,
            example_response: endpoint.example_response,
            params: endpoint.params || []
          };

          // Cek status endpoint
          try {
            const check = await axios.get(urlRest, { timeout: 5000 });
            epData.status = check.status === 200 ? "OK" : "ERROR";
          } catch (err) {
            if (err.response) {
              epData.status = `ERROR ${err.response.status}`;
            } else if (err.request) {
              epData.status = "NO RESPONSE";
            } else {
              epData.status = "ERROR";
            }
          }

          endpointsArr.push(epData);
        }
      }

      categories[categoryName] = {
        description: category.description || "",
        endpoints: endpointsArr
      };
    }

    // Update apiDoc
    apiDoc = {
      status: true,
      creator: "REST API Website",
      message: "Welcome to REST API Documentation",
      total_endpoints: totalEndpoints,
      categories
    };
  } catch (error) {
    apiDoc = {
      status: false,
      creator: "REST API Website",
      message: `Gagal ambil data dari ${apiUrl}: ${error.message}`,
      total_endpoints: 0,
      categories: {}
    };
  }

  // Kirim response
  res.json(apiDoc);
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
