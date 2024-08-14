export default (): Config => ({
  app: {
    environment: process.env.APP_ENVIRONMENT,
    port: parseInt(process.env.APP_PORT) || 3000,
    host: process.env.APP_HOST || '0.0.0.0',
    hashRounds: parseInt(process.env.SALT_OR_ROUNDS),
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE),
    maxFiles: parseInt(process.env.MAX_FILES),
    imagePath: process.env.IMAGE_PATH,
    frontend: process.env.FRONTEND_URL,
  },
  database: {
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DB,
  },
  redis: {
    port: parseInt(process.env.REDIS_PORT) || 6379,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    accessExpiresIn: process.env.ACCESS_EXPIRES_IN,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshExpiresIn: process.env.REFRESH_EXPIRES_IN,
  },
});
