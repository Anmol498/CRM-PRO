/**
 * Escapes special characters in a string for use in a regular expression.
 * Prevents ReDoS (Regular Expression Denial of Service) and unexpected query behavior.
 * 
 * @param str The string to escape
 * @returns The escaped string
 */
export const escapeRegex = (str: string): string => {
  if (typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
