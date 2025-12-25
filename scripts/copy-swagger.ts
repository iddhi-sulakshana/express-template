#!/usr/bin/env bun

import { readdirSync, statSync, mkdirSync, cpSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Dynamically copy all swagger files from src/modules to dist/modules
 * This script automatically discovers all modules and their swagger folders
 */

const SRC_MODULES_DIR = 'src/modules';
const DIST_MODULES_DIR = 'dist/modules';

function copySwaggerFiles() {
  console.log('🔍 Discovering modules and swagger files...');

  try {
    // Check if src/modules exists
    if (!existsSync(SRC_MODULES_DIR)) {
      console.log('❌ src/modules directory not found');
      return;
    }

    // Get all modules in src/modules
    const modules = readdirSync(SRC_MODULES_DIR).filter((item) => {
      const itemPath = join(SRC_MODULES_DIR, item);
      return statSync(itemPath).isDirectory();
    });

    console.log(`📁 Found ${modules.length} modules: ${modules.join(', ')}`);

    let copiedCount = 0;
    let skippedCount = 0;

    // Process each module
    for (const module of modules) {
      const moduleSrcPath = join(SRC_MODULES_DIR, module);
      const swaggerSrcPath = join(moduleSrcPath, 'swagger');

      // Check if swagger folder exists in this module
      if (existsSync(swaggerSrcPath) && statSync(swaggerSrcPath).isDirectory()) {
        const distModulePath = join(DIST_MODULES_DIR, module);
        const swaggerDistPath = join(distModulePath, 'swagger');

        // Create dist module directory if it doesn't exist
        if (!existsSync(distModulePath)) {
          mkdirSync(distModulePath, { recursive: true });
        }

        // Create dist swagger directory if it doesn't exist
        if (!existsSync(swaggerDistPath)) {
          mkdirSync(swaggerDistPath, { recursive: true });
        }

        // Copy swagger files
        try {
          cpSync(swaggerSrcPath, swaggerDistPath, { recursive: true });
          console.log(`✅ Copied swagger files for module: ${module}`);
          copiedCount++;
        } catch (error) {
          console.log(`❌ Failed to copy swagger files for module: ${module}`, error);
        }
      } else {
        console.log(`⏭️  Skipped module: ${module} (no swagger folder)`);
        skippedCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Copied: ${copiedCount} modules`);
    console.log(`   ⏭️  Skipped: ${skippedCount} modules`);
    console.log(`   📁 Total processed: ${modules.length} modules`);

    if (copiedCount === 0) {
      console.log('⚠️  No swagger files were copied. Make sure your modules have swagger folders.');
    }
  } catch (error) {
    console.error('❌ Error during swagger file copying:', error);
    process.exit(1);
  }
}

// Run the script
copySwaggerFiles();
