/**
 * Safely escapes special regular expression characters in user input strings
 * to prevent Regular Expression Denial of Service (ReDoS) vulnerabilities
 * and server-side crashes during search queries.
 */
export const escapeRegex = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
