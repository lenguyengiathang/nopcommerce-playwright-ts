import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["DB_SERVER", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"];

for (const variable of requiredEnv) {
  if (!process.env[variable]) {
    throw new Error(`${variable} is not defined in .env`);
  }
}

export const databaseConfig = {
  server: process.env.DB_SERVER!,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};
