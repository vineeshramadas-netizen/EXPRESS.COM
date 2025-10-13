export const env = {
  jwtSecret: process.env.JWT_SECRET || 'devsecret',
  port: Number(process.env.PORT || 4000),
};
