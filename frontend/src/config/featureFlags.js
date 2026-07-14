/**
 * Feature flags for optional app capabilities.
 *
 * Chat is disabled by default. To enable messaging (routes, WebSocket, UI):
 *   VITE_ENABLE_CHAT=true
 *
 * Add to frontend/.env and restart the dev server after changing.
 */
export const isChatEnabled = import.meta.env.VITE_ENABLE_CHAT === 'true';

export const featureFlags = {
  chat: isChatEnabled,
};
