import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  // Check if the path already has query parameters
  const hasQuery = path.includes('?');
  
  // If it has a query, use & to append the new parameter
  // Otherwise, use ? to start the query string
  const separator = hasQuery ? '&' : '?';
  
  return redirect(`${path}${separator}${type}=${encodeURIComponent(message)}`);
}
