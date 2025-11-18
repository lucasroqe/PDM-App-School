import { Router } from 'express';
import { 
  cadastrarAluno, 
  cadastrarProfessor, 
  cadastrarDisciplina,
  listarAlunos,
  listarProfessores,
  listarDisciplinas
} from '../controllers/cadastroController';
import { autenticarToken, requerirProfessor } from '../middleware/auth';

const router = Router();

router.post('/aluno', cadastrarAluno);
router.post('/professor', cadastrarProfessor);

router.get('/alunos', autenticarToken, listarAlunos);
router.get('/professores', autenticarToken, listarProfessores);
router.get('/disciplinas', autenticarToken, listarDisciplinas);

router.post('/disciplina', autenticarToken, requerirProfessor, cadastrarDisciplina);

export default router;

