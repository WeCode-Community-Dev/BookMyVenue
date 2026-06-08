export default () => ({
  port: parseInt(process.env.PORT || '3002', 10),
  database: {
    uri: process.env.MONGO_URI,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  }
});
