/**
 * Array of routes that don't need a logged in user i.e accessible to everyone hence public
 * @type {string[]}
 */

export const publicRoutes = ["/"];

/**
 * Routes used for authentication.
 * These routes redirects logged in users to /settings.
 * @type {string[]}
 */
export const authRoutes = ["/login", "/register"];

/**
 * Prefix for the authentication route
 * Routes with this prefix are used for API authentication purpose
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Route to redirect when a users successfully logs in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";