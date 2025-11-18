import { Router } from 'express';
import { consultarBoletim } from '../controllers/boletimController';
import { autenticarToken } from '../middleware/auth';

const router = Router();

router.get('/', autenticarToken, consultarBoletim);
router.get('/:alunoId', autenticarToken, consultarBoletim);

export default router;

