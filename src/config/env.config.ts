import * as dotenv from 'dotenv';
dotenv.config();

export const envConfig = {
  port: process.env.PORT || 3022,

  jwt_secret: process.env.JWT_SECRET || 'ThisIsMySecretForJWT',

  dbConfig: {
    dbName: process.env.DB_NAME,
    dbUsername: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbPort: +process.env.DB_PORT,
  },

  cloudinaryConfig: {
    cloudName: process.env.CLOUD_NAME,
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  },
};
