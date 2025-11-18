import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { CadastroAlunoRequest, CadastroProfessorRequest, CadastroDisciplinaRequest } from '../types';
import { AuthRequest } from '../middleware/auth';

export const cadastrarAluno = async (req: Request<{}, {}, CadastroAlunoRequest>, res: Response): Promise<void> => {
  try {
    const { email, senha, nome, matricula, curso } = req.body;

    if (!email || !senha || !nome || !matricula || !curso) {
      res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      return;
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const emailCheck = await client.query('SELECT id FROM tb_usuarios WHERE email = $1', [email]);
      if (emailCheck.rows.length > 0) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: 'Email já cadastrado' });
        return;
      }

      const matriculaCheck = await client.query('SELECT id FROM tb_usr_alunos WHERE matricula = $1', [matricula]);
      if (matriculaCheck.rows.length > 0) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: 'Matrícula já cadastrada' });
        return;
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const usuarioResult = await client.query(
        'INSERT INTO tb_usuarios (email, senha_hash, tipo_usuario) VALUES ($1, $2, $3) RETURNING id',
        [email, senhaHash, 'aluno']
      );

      const usuarioId = usuarioResult.rows[0].id;

      await client.query(
        'INSERT INTO tb_usr_alunos (usuario_id, nome, matricula, curso) VALUES ($1, $2, $3, $4)',
        [usuarioId, nome, matricula, curso]
      );

      await client.query('COMMIT');
      res.status(201).json({ message: 'Aluno cadastrado com sucesso' });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error: any) {
    console.error('Erro ao cadastrar aluno:', error);
    const errorMessage = error.message || 'Erro interno do servidor';
    res.status(500).json({ error: errorMessage, details: error.detail });
  }
};

export const cadastrarProfessor = async (req: Request<{}, {}, CadastroProfessorRequest>, res: Response): Promise<void> => {
  try {
    const { email, senha, nome, titulacao, tempo_docencia } = req.body;

    if (!email || !senha || !nome) {
      res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
      return;
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const emailCheck = await client.query('SELECT id FROM tb_usuarios WHERE email = $1', [email]);
      if (emailCheck.rows.length > 0) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: 'Email já cadastrado' });
        return;
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const usuarioResult = await client.query(
        'INSERT INTO tb_usuarios (email, senha_hash, tipo_usuario) VALUES ($1, $2, $3) RETURNING id',
        [email, senhaHash, 'professor']
      );

      const usuarioId = usuarioResult.rows[0].id;

      await client.query(
        'INSERT INTO tb_usr_professores (usuario_id, nome, titulacao, tempo_docencia) VALUES ($1, $2, $3, $4)',
        [usuarioId, nome, titulacao || null, tempo_docencia || null]
      );

      await client.query('COMMIT');
      res.status(201).json({ message: 'Professor cadastrado com sucesso' });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error: any) {
    console.error('Erro ao cadastrar professor:', error);
    const errorMessage = error.message || 'Erro interno do servidor';
    res.status(500).json({ error: errorMessage, details: error.detail });
  }
};

export const cadastrarDisciplina = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, carga_horaria, professor_id } = req.body;

    if (!nome || !carga_horaria || !professor_id) {
      res.status(400).json({ error: 'Nome, carga horária e professor são obrigatórios' });
      return;
    }

    const professorCheck = await pool.query('SELECT id FROM tb_usr_professores WHERE id = $1', [professor_id]);
    if (professorCheck.rows.length === 0) {
      res.status(400).json({ error: 'Professor não encontrado' });
      return;
    }

    const result = await pool.query(
      'INSERT INTO tb_disciplinas (nome, carga_horaria, professor_id) VALUES ($1, $2, $3) RETURNING id, nome, carga_horaria, professor_id, ativa',
      [nome, carga_horaria, professor_id]
    );

    res.status(201).json({ 
      message: 'Disciplina cadastrada com sucesso',
      disciplina: result.rows[0]
    });

  } catch (error: any) {
    console.error('Erro ao cadastrar disciplina:', error);
    const errorMessage = error.message || 'Erro interno do servidor';
    res.status(500).json({ error: errorMessage, details: error.detail });
  }
};

export const listarAlunos = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT a.id, a.nome, a.matricula, a.curso, a.ativo FROM tb_usr_alunos a ORDER BY a.nome'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar alunos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const listarProfessores = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT id, nome, titulacao, tempo_docencia FROM tb_usr_professores ORDER BY nome'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar professores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const listarDisciplinas = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT d.id, d.nome, d.carga_horaria, d.ativa, 
              p.id as professor_id, p.nome as professor_nome 
       FROM tb_disciplinas d 
       LEFT JOIN tb_usr_professores p ON d.professor_id = p.id 
       ORDER BY d.nome`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar disciplinas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

