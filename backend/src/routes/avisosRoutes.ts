import { Router } from 'express';
import { 
  criarAviso, 
  listarAvisos, 
  marcarAvisoComoLido, 
  contarAvisosNaoLidos,
  deletarAviso 
} from '../controllers/avisosController';
import { autenticarToken, requerirProfessor } from '../middleware/auth';

const router = Router();

router.post('/', autenticarToken, requerirProfessor, criarAviso);

router.get('/', autenticarToken, listarAvisos);

router.get('/nao-lidos', autenticarToken, contarAvisosNaoLidos);

router.post('/:id/lido', autenticarToken, marcarAvisoComoLido);

router.delete('/:id', autenticarToken, requerirProfessor, deletarAviso);

export default router;