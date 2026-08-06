const USER_ROLES = Object.freeze({
   CUSTOMER: "customer", // customer books venues
   VENUE_OWNER: "venueOwner", // lists and manages venues
   ADMIN: "admin", // platform administration
});

const USER_ROLE_VALUES = Object.values(USER_ROLES);

module.exports = { USER_ROLES, USER_ROLE_VALUES };
