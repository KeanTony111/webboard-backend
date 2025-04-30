import { get } from 'env-var';
import { config } from 'dotenv';

config({ path: '.env' });

export default () => ({
  port: get('APP_PORT').asInt() || 3001,
  database: {
    host: get('DATABASE_HOST').asString() || 'localhost',
    username: get('DATABASE_USERNAME').asString(),
    password: get('DATABASE_PASSWORD').asString(),
    database: get('DATABASE_NAME').asString(),
    port: get('DATABASE_PORT').asInt() || 3306,
  },
  jwt:{
    secret: get('SECRET_KEY').asString(),
    expiration: get('JWT_EXPIRATION').asString(),
  }
});