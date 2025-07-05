const fs = require("fs");
const path = require("path");

/**
 * Automatically analyze Express router files to extract endpoint information
 * without requiring manual endpoint definitions
 */
class RouteAnalyzer {
  constructor() {
    this.routePatterns = {
      // Pattern untuk mendeteksi route definitions
      routeDefinition: /router\.(get|post|put|delete|patch)\s*\(\s*["'`]([^"'`]+)["'`]/g,
      // Pattern untuk mendeteksi parameter dari req.query atau req.body
      queryParams: /req\.query\.(\w+)/g,
      bodyParams: /req\.body\.(\w+)/g,
      // Pattern untuk mendeteksi komentar yang menjelaskan endpoint
      endpointComment: /\/\/\s*(GET|POST|PUT|DELETE|PATCH)\s+([^\s]+)\s*-\s*(.+)/g
    };
  }

  /**
   * Analyze a single route file and extract endpoint information
   * @param {string} filePath - Path to the route file
   * @returns {Object} - Analyzed route information
   */
  analyzeRouteFile(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath, '.js');
      
      const endpoints = this.extractEndpoints(fileContent);
      const description = this.extractDescription(fileContent, fileName);
      
      return {
        fileName,
        description,
        endpoints,
        filePath
      };
    } catch (error) {
      console.error(`Error analyzing route file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Extract endpoint information from file content
   * @param {string} content - File content
   * @returns {Array} - Array of endpoint objects
   */
  extractEndpoints(content) {
    const endpoints = [];
    const lines = content.split('\n');
    
    // Reset regex lastIndex
    this.routePatterns.routeDefinition.lastIndex = 0;
    
    let match;
    while ((match = this.routePatterns.routeDefinition.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const path = match[2];
      
      // Find the line number for this route
      const routeLineIndex = content.substring(0, match.index).split('\n').length - 1;
      
      // Extract parameters and description for this specific route
      const params = this.extractParametersForRoute(content, routeLineIndex, lines);
      const description = this.extractDescriptionForRoute(lines, routeLineIndex);
      
      endpoints.push({
        path,
        method,
        params,
        description
      });
    }
    
    return endpoints;
  }

  /**
   * Extract parameters for a specific route
   * @param {string} content - Full file content
   * @param {number} routeLineIndex - Line index where route is defined
   * @param {Array} lines - Array of file lines
   * @returns {Array} - Array of parameter names
   */
  extractParametersForRoute(content, routeLineIndex, lines) {
    const params = new Set();
    
    // Look for the route function (usually starts after the route definition)
    let functionStart = routeLineIndex;
    let functionEnd = routeLineIndex + 50; // Look ahead 50 lines max
    
    // Find the actual function boundaries
    let braceCount = 0;
    let inFunction = false;
    
    for (let i = routeLineIndex; i < lines.length && i < functionEnd; i++) {
      const line = lines[i];
      
      if (line.includes('(req, res)') || line.includes('async (req, res)')) {
        inFunction = true;
      }
      
      if (inFunction) {
        // Count braces to find function end
        braceCount += (line.match(/{/g) || []).length;
        braceCount -= (line.match(/}/g) || []).length;
        
        // Extract parameters from this line
        this.extractParamsFromLine(line, params);
        
        if (braceCount === 0 && line.includes('}')) {
          break;
        }
      }
    }
    
    return Array.from(params);
  }

  /**
   * Extract parameters from a single line
   * @param {string} line - Line of code
   * @param {Set} params - Set to add parameters to
   */
  extractParamsFromLine(line, params) {
    // Extract from req.query
    const queryMatches = line.matchAll(/req\.query\.(\w+)/g);
    for (const match of queryMatches) {
      params.add(match[1]);
    }
    
    // Extract from req.body
    const bodyMatches = line.matchAll(/req\.body\.(\w+)/g);
    for (const match of bodyMatches) {
      params.add(match[1]);
    }
    
    // Extract from destructuring
    const destructureQuery = line.match(/const\s*{\s*([^}]+)\s*}\s*=\s*req\.query/);
    if (destructureQuery) {
      const paramNames = destructureQuery[1].split(',').map(p => p.trim().split('=')[0].trim());
      paramNames.forEach(param => params.add(param));
    }
    
    const destructureBody = line.match(/const\s*{\s*([^}]+)\s*}\s*=\s*req\.body/);
    if (destructureBody) {
      const paramNames = destructureBody[1].split(',').map(p => p.trim().split('=')[0].trim());
      paramNames.forEach(param => params.add(param));
    }
  }

  /**
   * Extract description for a specific route from comments
   * @param {Array} lines - Array of file lines
   * @param {number} routeLineIndex - Line index where route is defined
   * @returns {string} - Route description
   */
  extractDescriptionForRoute(lines, routeLineIndex) {
    // Look for comment above the route (up to 3 lines above)
    for (let i = Math.max(0, routeLineIndex - 3); i < routeLineIndex; i++) {
      const line = lines[i].trim();
      if (line.startsWith('//')) {
        // Extract description from comment
        const commentMatch = line.match(/\/\/\s*(GET|POST|PUT|DELETE|PATCH)?\s*([^\s-]*)\s*-?\s*(.+)/i);
        if (commentMatch && commentMatch[3]) {
          return commentMatch[3].trim();
        }
      }
    }
    return '';
  }

  /**
   * Extract general description for the route file
   * @param {string} content - File content
   * @param {string} fileName - File name
   * @returns {string} - File description
   */
  extractDescription(content, fileName) {
    // Look for description in comments at the top of the file
    const lines = content.split('\n');
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i].trim();
      if (line.startsWith('//') && line.toLowerCase().includes('api')) {
        return line.replace(/^\/\/\s*/, '').trim();
      }
    }
    
    // Generate description based on file name
    const descriptions = {
      'ai': 'Artificial Intelligence related APIs',
      'download': 'Media download APIs',
      'search': 'Search and information APIs',
      'tools': 'Utility and tool APIs',
      'random': 'Random data generation APIs',
      'stalk': 'Social media stalking APIs',
      'user': 'User management APIs'
    };
    
    return descriptions[fileName] || `${fileName.charAt(0).toUpperCase() + fileName.slice(1)} APIs`;
  }

  /**
   * Analyze all route files in a directory
   * @param {string} routesDir - Directory containing route files
   * @returns {Object} - Complete analysis result
   */
  analyzeAllRoutes(routesDir) {
    const result = {
      categories: {},
      totalEndpoints: 0
    };

    try {
      // Analyze user.js separately
      const userRoutePath = path.join(routesDir, 'user.js');
      if (fs.existsSync(userRoutePath)) {
        const userAnalysis = this.analyzeRouteFile(userRoutePath);
        if (userAnalysis && userAnalysis.endpoints.length > 0) {
          result.categories.User = {
            description: userAnalysis.description,
            endpoints: userAnalysis.endpoints.map(ep => ({
              path: `/api${ep.path}`,
              method: ep.method,
              params: ep.params,
              description: ep.description
            }))
          };
          result.totalEndpoints += userAnalysis.endpoints.length;
        }
      }

      // Analyze API routes
      const apiRoutesDir = path.join(routesDir, 'api');
      if (fs.existsSync(apiRoutesDir)) {
        const apiFiles = fs.readdirSync(apiRoutesDir).filter(file => file.endsWith('.js'));
        
        for (const file of apiFiles) {
          const filePath = path.join(apiRoutesDir, file);
          const analysis = this.analyzeRouteFile(filePath);
          
          if (analysis && analysis.endpoints.length > 0) {
            const categoryName = analysis.fileName.charAt(0).toUpperCase() + analysis.fileName.slice(1);
            const urlPrefix = `/api/${analysis.fileName}`;
            
            result.categories[categoryName] = {
              description: analysis.description,
              endpoints: analysis.endpoints.map(ep => ({
                path: `${urlPrefix}${ep.path}`,
                method: ep.method,
                params: ep.params,
                description: ep.description
              }))
            };
            result.totalEndpoints += analysis.endpoints.length;
          }
        }
      }
    } catch (error) {
      console.error('Error analyzing routes:', error);
    }

    return result;
  }
}

module.exports = RouteAnalyzer;

