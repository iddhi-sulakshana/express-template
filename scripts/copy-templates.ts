#!/usr/bin/env bun

import { existsSync, mkdirSync, cpSync } from 'fs';

/**
 * Copy template files from src/templates to dist/templates
 * This ensures EJS templates are available in the production build
 */

const SRC_TEMPLATES_DIR = 'src/templates';
const DIST_TEMPLATES_DIR = 'dist/templates';

function copyTemplateFiles() {
  console.log('📧 Copying email templates...');

  try {
    // Check if src/templates exists
    if (!existsSync(SRC_TEMPLATES_DIR)) {
      console.log('❌ src/templates directory not found');
      return;
    }

    // Create dist/templates directory if it doesn't exist
    if (!existsSync(DIST_TEMPLATES_DIR)) {
      mkdirSync(DIST_TEMPLATES_DIR, { recursive: true });
    }

    // Copy template files
    try {
      cpSync(SRC_TEMPLATES_DIR, DIST_TEMPLATES_DIR, { recursive: true });
      console.log('✅ Copied template files to dist/templates');
    } catch (error) {
      console.error('❌ Failed to copy template files:', error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error during template file copying:', error);
    process.exit(1);
  }
}

// Run the script
copyTemplateFiles();
