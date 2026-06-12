export const API_ROUTES = {
  AUTH: {
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
    PROFILE: "/auth/me",
  },

  VENUES: {
    GET_ALL: "/venues",
    CREATE: "/venues/register",
    GET_BY_ID: (id) => `/venues/${id}`,
    UPDATE: (id) => `/venues/${id}`,
    DELETE: (id) => `/venues/${id}`,
  },
};
