export const paths = {
  home: { path: '/' },
  auth: {
    login: { path: '/login' },
    register: { path: '/register' },
  },
  venues: {
    detail: { path: '/venues/:id', getHref: (id) => `/venues/${id}` },
  },
  bookings: {
    mine: { path: '/my-bookings' },
  },
  owner: {
    dashboard: { path: '/owner/dashboard' },
    venueNew: { path: '/owner/venues/new' },
    venueEdit: {
      path: '/owner/venues/:id/edit',
      getHref: (id) => `/owner/venues/${id}/edit`,
    },
  },
};
