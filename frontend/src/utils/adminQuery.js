export const buildAdminQueryParams = (params = {}) => {
  const query = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query[key] = value;
    }
  });

  return query;
};
