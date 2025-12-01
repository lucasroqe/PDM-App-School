import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'app_scholar',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20,
};

const pool = new Pool(databaseConfig);

pool.on('connect', () => {
  console.log('Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Erro na conexão com PostgreSQL:', err);
});

pool.query('SELECT NOW()')
  .then(() => {
    console.log('Teste de conexão com banco de dados: OK');
  })
  .catch((err) => {
    console.error('Erro ao testar conexão com banco de dados:', err.message);
  });

export default pool;