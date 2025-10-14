export const env = {
  jwtSecret: process.env.JWT_SECRET || 'devsecret',
  port: Number(process.env.PORT || 4000),
  allowedOrigin: process.env.ALLOWED_ORIGIN || process.env.WEB_BASE_URL || 'http://localhost:3000',
};
