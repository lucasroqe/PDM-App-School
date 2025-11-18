import express from 'express';
import { corsMiddleware } from './middleware/cors';
import authRoutes from './routes/authRoutes';
import cadastroRoutes from './routes/cadastroRoutes';
import boletimRoutes from './routes/boletimRoutes';

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());

app.use(corsMiddleware);

app.use('/auth', authRoutes);
app.use('/cadastro', cadastroRoutes);
app.use('/boletim', boletimRoutes);

app.get('/', (req, res) => {
  res.send('Servidor Express ok');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});