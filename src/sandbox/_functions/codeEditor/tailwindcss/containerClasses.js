/**
 * Container Query Variants of Tailwind Classes
 * 
 * This file is auto-generated from classes.js and provides container query
 * variants (@sm:, @md:, @lg:, @xl:, @2xl:) for all Tailwind utility classes.
 * 
 * Purpose: Tailwind's JIT compiler scans this file to generate CSS for
 * container query variants, enabling responsive classes to work per-blueprint.
 * 
 * DO NOT EDIT MANUALLY - regenerate by running the containerClasses generator
 */

import { tailwindcssClasses } from "./classes.js";

const BREAKPOINTS = ['sm', 'md', 'lg', 'xl', '2xl'];

/**
 * Generate container query variants for all Tailwind classes
 * e.g., "flex" becomes ["@sm:flex", "@md:flex", "@lg:flex", "@xl:flex", "@2xl:flex"]
 */
export const containerQueryClasses = BREAKPOINTS.flatMap(bp =>
  tailwindcssClasses.map(cls => `@${bp}:${cls}`)
);

// Also export the @container class itself
export const containerClass = "@container";

// Export all classes as a single array for Tailwind to scan
export const allContainerClasses = [containerClass, ...containerQueryClasses];
