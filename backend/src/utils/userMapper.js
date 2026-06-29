export function toPublicUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    mobileNumber: user.mobileNumber,
    role: user.role,
    createdAt: user.createdAt,
  };
}
