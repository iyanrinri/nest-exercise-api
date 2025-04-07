import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 3306,
  username: process.env.DATABASE_USER || 3306,
  password: process.env.DATABASE_PASSWORD || 3306,
  database: process.env.DATABASE_NAME || 3306,
}));
