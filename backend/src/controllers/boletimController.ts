import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { BoletimResponse } from '../types';

export const consultarBoletim = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const usuarioId = req.usuario?.id;
    const alunoIdParam = req.params?.alunoId;

    let alunoId: number;

    if (req.usuario?.tipo_usuario === 'aluno') {
      const alunoResult = await pool.query(
        'SELECT id FROM tb_usr_alunos WHERE usuario_id = $1',
        [usuarioId]
      );

      if (alunoResult.rows.length === 0) {
        res.status(404).json({ error: 'Aluno não encontrado' });
        return;
      }

      alunoId = alunoResult.rows[0].id;
    } else if (alunoIdParam) {
      alunoId = parseInt(alunoIdParam);
    } else {
      res.status(400).json({ error: 'ID do aluno é necessário para admin/professor' });
      return;
    }

    const alunoResult = await pool.query(
      'SELECT id, nome, matricula, curso FROM tb_usr_alunos WHERE id = $1',
      [alunoId]
    );

    if (alunoResult.rows.length === 0) {
      res.status(404).json({ error: 'Aluno não encontrado' });
      return;
    }

    const aluno = alunoResult.rows[0];

    const disciplinasResult = await pool.query(
      `SELECT 
        d.id as disciplina_id,
        d.nome as disciplina_nome,
        d.carga_horaria,
        p.nome as professor_nome,
        m.ano_semestre,
        m.situacao,
        n.nota1,
        n.nota2,
        n.nota3,
        n.media_final,
        n.situacao_final
      FROM tb_matriculas m
      INNER JOIN tb_disciplinas d ON m.disciplina_id = d.id
      LEFT JOIN tb_usr_professores p ON d.professor_id = p.id
      LEFT JOIN tb_notas n ON m.id = n.matricula_id
      WHERE m.aluno_id = $1
      ORDER BY m.ano_semestre DESC, d.nome`,
      [alunoId]
    );

    const boletim: BoletimResponse = {
      aluno_id: aluno.id,
      aluno_nome: aluno.nome,
      matricula: aluno.matricula,
      curso: aluno.curso,
      disciplinas: disciplinasResult.rows.map(row => ({
        disciplina_id: row.disciplina_id,
        disciplina_nome: row.disciplina_nome,
        carga_horaria: row.carga_horaria,
        professor_nome: row.professor_nome || 'Não definido',
        ano_semestre: row.ano_semestre,
        nota1: row.nota1 ? parseFloat(row.nota1) : 0,
        nota2: row.nota2 ? parseFloat(row.nota2) : 0,
        nota3: row.nota3 ? parseFloat(row.nota3) : 0,
        media_final: row.media_final ? parseFloat(row.media_final) : 0,
        situacao_final: row.situacao_final || 'em andamento'
      }))
    };

    res.json(boletim);

  } catch (error) {
    console.error('Erro ao consultar boletim:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

