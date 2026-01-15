/**
 * Transforms Tailwind viewport breakpoints to container query variants.
 * 
 * Converts: sm:, md:, lg:, xl:, 2xl: → @sm:, @md:, @lg:, @xl:, @2xl:
 * 
 * This enables responsive classes to respond to the blueprint's viewport width
 * instead of the browser window width, making responsive preview work correctly.
 * 
 * @example
 * // Input:  "md:bg-blue-500 lg:text-white"
 * // Output: "@md:bg-blue-500 @lg:text-white"
 */

const BREAKPOINT_PREFIXES = ['sm', 'md', 'lg', 'xl', '2xl'];

/**
 * Transform viewport breakpoints to container query variants in source code.
 * Matches breakpoint prefixes that are preceded by whitespace, quotes, or backticks
 * to ensure we only transform class names, not arbitrary code.
 */
export function transformBreakpointsToContainer(code: string): string {
  // Build regex pattern for all breakpoint prefixes
  // Lookbehind: must be preceded by whitespace, quote, or backtick (class context)
  // Negative lookbehind: must NOT already be prefixed with @ (avoid double transform)
  // Captures the breakpoint name to preserve it in replacement
  const pattern = new RegExp(
    `(?<=[\\s"'\`])(?<!@)(${BREAKPOINT_PREFIXES.join('|')}):`,
    'g'
  );

  return code.replace(pattern, '@$1:');
}
