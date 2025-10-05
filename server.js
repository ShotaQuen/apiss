const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();
require("./settings/module.js");

const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 5000;

// === Supabase client ===
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "static")));

// === Middleware global untuk hitung request ===
app.use(async (req, res, next) => {
  try {
    // ambil baris pertama
    const { data, error } = await supabase
      .from("request_count")
      .select("id, total")
      .limit(1)
      .maybeSingle();

    if (error) console.error("❌ Supabase select error:", error);

    if (data) {
      await supabase
        .from("request_count")
        .update({ total: data.total + 1 })
        .eq("id", data.id);
    } else {
      await supabase.from("request_count").insert([{ total: 1 }]);
    }
  } catch (err) {
    console.error("❌ Error update request count:", err.message);
  }
  next();
});

// Endpoint cek total request
app.get("/api/requests", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("request_count")
      .select("total")
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);

    res.json({
      status: true,
      total_requests: data ? data.total : 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Helper parsing query params ===
const extractQueryParams = (handlerCode) => {
  const params = new Set();
  const destructuringPattern = /const\s*{\s*([^}]+)\s*}\s*=\s*req\.query/g;
  let match;
  while ((match = destructuringPattern.exec(handlerCode)) !== null) {
    match[1].split(",").forEach((p) => params.add(p.split("=")[0].trim()));
  }
  const directAccessPattern = /req\.query\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  while ((match = directAccessPattern.exec(handlerCode)) !== null) {
    params.add(match[1]);
  }
  return Array.from(params);
};

// === Loader otomatis routes ===
const loadRoutes = () => {
  const apiRoutesDir = path.join(__dirname, "routes", "api");
  const categories = {};
  let totalEndpoints = 0;

  const extractPathParams = (routePath) => {
    const regex = /:([a-zA-Z0-9_]+)/g;
    let match, params = [];
    while ((match = regex.exec(routePath)) !== null) params.push(match[1]);
    return params;
  };

  const readFilesRecursive = (dir) => {
    let result = [];
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        result = result.concat(readFilesRecursive(fullPath));
      } else if (file.endsWith(".js")) {
        result.push(fullPath);
      }
    });
    return result;
  };

  const apiRouteFiles = readFilesRecursive(apiRoutesDir);
  for (const file of apiRouteFiles) {
    const relativePath = path.relative(apiRoutesDir, file).replace(/\\/g, "/");
    const routeName = relativePath.replace(".js", "");
    const categoryName = routeName.split("/")[0];
    const routeModule = require(file);

    const urlPrefix = "/" + categoryName;
    app.use(urlPrefix, routeModule);

    const fileContent = fs.readFileSync(file, "utf8");
    const moduleEndpoints = [];

    routeModule.stack.forEach((layer) => {
      if (layer.route) {
        const routePath = layer.route.path;
        const methods = Object.keys(layer.route.methods);
        methods.forEach((method) => {
          moduleEndpoints.push({
            path: `${urlPrefix}${routePath}`,
            method: method.toUpperCase(),
            example_response: routeModule.example_response || null,
            params: [...extractPathParams(routePath), ...extractQueryParams(fileContent)],
          });
        });
      }
    });

    const categoryKey = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    if (!categories[categoryKey]) {
      categories[categoryKey] = { description: `APIs for ${categoryName}`, endpoints: [] };
    }
    moduleEndpoints.forEach((ep) => {
      if (!categories[categoryKey].endpoints.some((e) => e.path === ep.path && e.method === ep.method)) {
        categories[categoryKey].endpoints.push(ep);
        totalEndpoints++;
      }
    });
  }

  return { categories, totalEndpoints };
};

const { categories, totalEndpoints } = loadRoutes();

// === Endpoint Dokumentasi API ===
app.get("/api", async (req, res) => {
  const { data } = await supabase.from("request_count").select("total").limit(1).maybeSingle();
  res.json({
    status: true,
    creator: "Ikann",
    message: "Welcome to REST API Documentation",
    total_endpoints: totalEndpoints,
    total_requests: data ? data.total : 0,
    categories,
  });
});

// === API check ===
app.get("/api/check", async (req, res) => {
  const apiUrl = "https://berak-new-pjq3.vercel.app/api"; // pakai API utama

  let apiDoc = {
    status: true,
    creator: "Ikann",
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
              epData.status = `ERROR`;
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

// === API Cleanup ===
app.get("/api/cleanup", async (req, res) => {
  const apiRoutesDir = path.join(__dirname, "routes", "api");

  const readFilesRecursive = (dir) => {
    let result = [];
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        result = result.concat(readFilesRecursive(fullPath));
      } else if (file.endsWith(".js")) {
        result.push(fullPath);
      }
    });
    return result;
  };

  const apiRouteFiles = readFilesRecursive(apiRoutesDir);
  const endpoints = [];

  // Step 1: Ambil semua endpoint (termasuk yang error)
  for (const file of apiRouteFiles) {
    try {
      const relativePath = path.relative(apiRoutesDir, file).replace(/\\/g, "/");
      const routeName = relativePath.replace(".js", "");
      const categoryName = routeName.split("/")[0];
      const urlPrefix = "/" + categoryName;

      const routeModule = require(file);
      routeModule.stack.forEach((layer) => {
        if (layer.route) {
          const methods = Object.keys(layer.route.methods);
          methods.forEach((method) => {
            endpoints.push({
              file,
              path: `${urlPrefix}${layer.route.path}`,
              method: method.toUpperCase(),
              error: false,
            });
          });
        }
      });
    } catch (err) {
      endpoints.push({
        file,
        path: null,
        method: null,
        error: true,
      });
      console.error(`❌ Error load: ${file} — ${err.message}`);
    }
  }

  // Step 2: Hapus endpoint yang duplikat dan error
  const unique = [];
  const removed = [];

  endpoints.forEach((ep) => {
    const duplicate = unique.find(
      (u) => u.path === ep.path && u.method === ep.method
    );
    if (!duplicate) {
      unique.push(ep);
    } else {
      // kalau duplikat & error → hapus dari daftar
      if (ep.error) {
        removed.push(ep);
        console.log(`🗑️ Hapus endpoint duplikat-error: ${ep.file}`);
      }
    }
  });

  // Step 3: Buat hasil
  res.json({
    status: true,
    message: "Cleanup selesai",
    total_files: apiRouteFiles.length,
    total_endpoints: unique.length,
    removed: removed.map((r) => ({
      file: r.file,
      error: r.error,
      path: r.path,
      method: r.method,
    })),
  });
});

// SPA support
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});

module.exports = app;
