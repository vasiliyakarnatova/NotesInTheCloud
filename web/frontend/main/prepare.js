/**
 * This script prepares the project for VS Code by:
 * 1. Creating an updated vite.config.ts file
 * 2. Creating a .env file template
 * 3. Updating package.json for Windows compatibility
 * 4. Removing Replit dependencies
 * 5. Adding TypeScript type declarations
 * 6. Providing instructions for running the app
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create new vite.config.ts
const viteConfig = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
});
`;

// Create .env template
const envTemplate = `
# Database configuration
DATABASE_URL=postgresql://username:password@localhost:5432/yourdatabase
PGUSER=username
PGHOST=localhost
PGPASSWORD=password
PGDATABASE=yourdatabase
PGPORT=5432

# Session secret
SESSION_SECRET=your-session-secret
`;

// Create vite-env.d.ts
const viteEnvDts = `/// <reference types="vite/client" />`;

// Create tsconfig.node.json
const tsconfigNode = `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`;

// Create a simple custom server.js
const serverJs = `
const express = require('express');
const path = require('path');
const { registerRoutes } = require('./server/routes');

// Create Express app
const app = express();

// Setup middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Register API routes
const httpServer = registerRoutes(app);

// Start the server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
httpServer.listen(parseInt(PORT), () => {
  console.log(\`Server running on \${HOST}:\${PORT}\`);
});
`;

// Update package.json to use cross-env and be Windows compatible
function updatePackageJson() {
  try {
    // Read the existing package.json
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Update the scripts section
    packageJson.scripts = {
      ...packageJson.scripts,
      "dev": "cross-env NODE_ENV=development tsx server/index.ts",
      "start": "cross-env NODE_ENV=production node dist/index.js",
      "dev:windows": "start-windows.bat"
    };

    // Remove Replit devDependencies
    if (packageJson.devDependencies) {
      delete packageJson.devDependencies['@replit/vite-plugin-cartographer'];
      delete packageJson.devDependencies['@replit/vite-plugin-runtime-error-modal'];
    }

    // Make sure @types/node is included
    if (!packageJson.devDependencies) {
      packageJson.devDependencies = {};
    }
    packageJson.devDependencies['@types/node'] = '^20.16.0';

    // Save as package.json.new to not overwrite directly
    fs.writeFileSync('package.json.new', JSON.stringify(packageJson, null, 2));
    console.log('✅ Created package.json.new - Rename to package.json when ready');
    return true;
  } catch (error) {
    console.error('❌ Error updating package.json:', error);
    return false;
  }
}

// Update client/index.html to remove Replit banner
function updateIndexHtml() {
  try {
    const indexHtmlPath = path.join(__dirname, 'client', 'index.html');
    let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

    // Remove the Replit script
    indexHtml = indexHtml.replace(
      /<script type="text\/javascript" src="https:\/\/replit\.com\/public\/js\/replit-dev-banner\.js"><\/script>/,
      ''
    );

    // Save as index.html.new
    fs.writeFileSync('client/index.html.new', indexHtml);
    console.log('✅ Created client/index.html.new - Rename to client/index.html when ready');
    return true;
  } catch (error) {
    console.error('❌ Error updating index.html:', error);
    return false;
  }
}

// Create TypeScript type declaration files
function createTypeDeclarations() {
  try {
    // Create vite-env.d.ts
    fs.writeFileSync('client/src/vite-env.d.ts', viteEnvDts);
    console.log('✅ Created client/src/vite-env.d.ts - TypeScript will now recognize Vite types');
    
    // Create tsconfig.node.json
    fs.writeFileSync('tsconfig.node.json', tsconfigNode);
    console.log('✅ Created tsconfig.node.json - Helps with TypeScript configuration');
    
    return true;
  } catch (error) {
    console.error('❌ Error creating TypeScript declarations:', error);
    return false;
  }
}

// Write files
try {
  // Save as vite.config.new.ts to not overwrite the original directly
  fs.writeFileSync('vite.config.new.ts', viteConfig.trim());
  console.log('✅ Created vite.config.new.ts - Rename to vite.config.ts when ready');

  fs.writeFileSync('.env.template', envTemplate.trim());
  console.log('✅ Created .env.template - Rename to .env and update with your values');

  fs.writeFileSync('server.new.js', serverJs.trim());
  console.log('✅ Created server.new.js - Use this as an alternative server entry point if needed');

  // Update package.json and index.html
  const packageJsonUpdated = updatePackageJson();
  const indexHtmlUpdated = updateIndexHtml();
  const typeDeclarationsCreated = createTypeDeclarations();
  
  // Create a batch file to help with setup
  const setupBatchContent = `@echo off
echo Renaming generated files...
move vite.config.new.ts vite.config.ts
move package.json.new package.json
move client\\index.html.new client\\index.html
copy .env.template .env

echo Installing dependencies...
npm install

echo Setup complete! You can now start the application with:
echo start-windows.bat
pause
`;

  fs.writeFileSync('setup-windows.bat', setupBatchContent);
  console.log('✅ Created setup-windows.bat - Run this to automatically set up your project');

  console.log('\n🔨 NEXT STEPS:');
  console.log('1. Option 1: Run setup-windows.bat to automatically set up everything');
  console.log('   OR');
  console.log('2. Option 2: Manually rename the following files:');
  console.log('   - vite.config.new.ts → vite.config.ts');
  console.log('   - package.json.new → package.json');
  console.log('   - client/index.html.new → client/index.html');
  console.log('   - copy .env.template → .env');
  console.log('   Then run: npm install');
  console.log('3. Start the app with: start-windows.bat');
  console.log('4. For complete instructions, refer to VS_CODE_SETUP.md');

} catch (error) {
  console.error('❌ Error creating files:', error);
}