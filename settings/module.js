const fs = require('fs');
const path = require('path');

const pkgPath = path.join(process.cwd(), 'package.json');

if (!fs.existsSync(pkgPath)) {
  console.warn('[module.js] package.json not found at', pkgPath);
  module.exports = {};
  return;
}

let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
} catch (e) {
  console.warn('[module.js] Failed to parse package.json:', e.message);
  module.exports = {};
  return;
}

const deps = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});

function toGlobalName(pkgName) {
  let name = pkgName.replace(/^@/, '').replace(/\//g, '-');
  const parts = name.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (parts.length === 0) return name;
  const first = parts.shift().toLowerCase();
  const rest = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1));
  return [first, ...rest].join('');
}

const exported = {};
Object.keys(deps).forEach((pkgName) => {
  const globalName = toGlobalName(pkgName);
  try {
    // Skip nodemon di production
    if (pkgName === "nodemon" && process.env.NODE_ENV === "production") {
      return;
    }

    const mod = require(pkgName);

    if (typeof global[globalName] === 'undefined') {
      global[globalName] = mod;
    }

    if (pkgName === 'express' && typeof global.router === 'undefined') {
      try {
        global.router = mod.Router();
      } catch (e) {}
    }

    exported[globalName] = mod;
    exported[pkgName] = mod;
  } catch (err) {
    console.warn(`[module.js] require("${pkgName}") failed: ${err.message}`);
  }
});

// Helper untuk ambil modul by nama
global.getModule = function (name) {
  if (!name) return undefined;
  const g = toGlobalName(name);
  if (global[g]) return global[g];
  return exported[name] || exported[g];
};

// Shim window biar tidak error di Node.js
if (typeof global.window === "undefined") {
  global.window = {
    location: {
      origin: `http://localhost:${process.env.PORT || 5000}`
    }
  };
}

module.exports = exported;