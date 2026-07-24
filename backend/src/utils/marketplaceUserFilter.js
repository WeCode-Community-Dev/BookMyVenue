export const MARKETPLACE_USER_FILTER = {
    roles: { $nin: ["admin"] },
};

export const withMarketplaceUserFilter = (filter = {}) => {
    const hasConditions = Object.keys(filter).length > 0;

    if (!hasConditions) {
        return { ...MARKETPLACE_USER_FILTER };
    }

    return {
        $and: [MARKETPLACE_USER_FILTER, filter],
    };
};

export const isPlatformOperator = (user) =>
    Array.isArray(user?.roles) && user.roles.includes("admin");

export const escapeRegex = (value = "") =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const buildSearchRegex = (value = "") =>
    new RegExp(escapeRegex(value.trim()), "i");
