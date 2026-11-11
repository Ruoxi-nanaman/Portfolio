/**
 * Shared utility functions.
 */

/**
 * Joins the provided values into a single space-separated class string,
 * ignoring falsy values.
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
