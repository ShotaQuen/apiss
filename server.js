const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));

const loadRoutes = () => {
    const apiRoutesDir = path.join(__dirname, "routes", "api");
    const categories = {};
    let totalEndpoints = 0;

    const apiRouteFiles = fs.readdirSync(apiRoutesDir).filter(file => file.endsWith(".js"));

    for (const file of apiRouteFiles) {
        const routeName = file.replace(".js", "");
        const routeModule = require(path.join(apiRoutesDir, file));

        const urlPrefix = `/api/${routeName}`;
        app.use(urlPrefix, routeModule);

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

app.get("/api", (req, res) => {
    res.json({
        status: true,
        creator: "REST API Website",
        message: "Welcome to REST API Documentation",
        total_endpoints: totalEndpoints,
        categories: categories
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
