import * as dotenv from 'dotenv';
dotenv.config();

export const envConfig = {
  port: () => {
    return process.env.PORT || 3022;
  },

  jwt_secret: () => {
    return process.env.JWT_SECRET || 'ThisIsMySecretForJWT';
  },

  db_credentials: () => {
    return {
      db_name: process.env.DB_NAME,
      db_username: process.env.DB_USERNAME,
      db_password: process.env.DB_PASSWORD,
      db_host: process.env.DB_HOST,
      db_port: +process.env.DB_PORT,
    };
  },
};
