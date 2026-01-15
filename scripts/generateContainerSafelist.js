/**
 * Script to generate static container query safelist
 * Run with: node scripts/generateContainerSafelist.js
 */

import { tailwindcssClasses } from '../src/sandbox/_functions/codeEditor/tailwindcss/classes.js';
import { writeFileSync } from 'fs';

const BREAKPOINTS = ['sm', 'md', 'lg', 'xl', '2xl'];

// Generate all container query variants
const containerClasses = ['@container'];
for (const bp of BREAKPOINTS) {
  for (const cls of tailwindcssClasses) {
    containerClasses.push(`@${bp}:${cls}`);
  }
}

// Write to a file that Tailwind can scan
writeFileSync('container-safelist.txt', containerClasses.join('\n'));

console.log(`Generated ${containerClasses.length} container query classes`);
