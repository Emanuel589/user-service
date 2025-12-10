import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres12345',
  database: process.env.DB_NAME || 'user_service_db',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'], // 👈 Importante: usa la carpeta compilada
  synchronize: false, // 👈 siempre en false cuando usas migraciones
  logging: true,
});
