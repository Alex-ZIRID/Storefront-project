import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_TEST_DB,
  ENV,
} = process.env;


let client: Pool;

try {
  if (ENV === 'test') {
    client = new Pool({
      host: POSTGRES_HOST,
      database: POSTGRES_TEST_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      port: Number(process.env.DB_PORT) || 5432,
    });
  } else if (ENV === 'dev') {
    client = new Pool({
      host: POSTGRES_HOST,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      port: Number(process.env.DB_PORT) || 5432,
    });
  } else {
    throw new Error("Invalid ENV value. Must be 'test' or 'dev'");
  }

  // Log successful connection
  client.on('connect', () => {
   
  });

  // Log database errors
  client.on('error', (err) => {
 
  });

} catch (error) {
  throw error; 
}

export default client;