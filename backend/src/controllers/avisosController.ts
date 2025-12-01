import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export interface Aviso {
  id: number;
  titulo: string;
  conteudo: string;
  autor_id: number;
  autor_nome?: string;
  tipo: string;
  criado_em: Date;
  atualizado_em: Date;
  ativo: boolean;
  lido?: boolean;
}

export const criarAviso = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { titulo, conteudo, tipo } = req.body;
    const autorId = req.usuario?.id;

    if (!titulo || !conteudo) {
      res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
      return;
    }

    const tipoAviso = tipo || 'geral';
    if (!['geral', 'lembrete', 'institucional'].includes(tipoAviso)) {
      res.status(400).json({ error: 'Tipo de aviso inválido' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO tb_avisos (titulo, conteudo, autor_id, tipo)
       VALUES ($1, $2, $3, $4)
       RETURNING id, titulo, conteudo, autor_id, tipo, criado_em, atualizado_em, ativo`,
      [titulo, conteudo, autorId, tipoAviso]
    );

    const aviso = result.rows[0];
    res.status(201).json({ message: 'Aviso criado com sucesso', aviso });
  } catch (error) {
    console.error('Erro ao criar aviso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const listarAvisos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const usuarioId = req.usuario?.id;
    const tipoUsuario = req.usuario?.tipo_usuario;

    let query = `
      SELECT 
        a.id,
        a.titulo,
        a.conteudo,
        a.autor_id,
        a.tipo,
        a.criado_em,
        a.atualizado_em,
        a.ativo,
        COALESCE(u_a.nome, u_p.nome, u_adm.nome) as autor_nome
      FROM tb_avisos a
      LEFT JOIN tb_usuarios u ON a.autor_id = u.id
      LEFT JOIN tb_usr_alunos u_a ON u.id = u_a.usuario_id
      LEFT JOIN tb_usr_professores u_p ON u.id = u_p.usuario_id
      LEFT JOIN tb_usr_adm u_adm ON u.id = u_adm.usuario_id
      WHERE a.ativo = true
      ORDER BY a.criado_em DESC
    `;

    const avisosResult = await pool.query(query);
    let avisos = avisosResult.rows;

    if (tipoUsuario === 'aluno') {
      const alunoResult = await pool.query(
        'SELECT id FROM tb_usr_alunos WHERE usuario_id = $1',
        [usuarioId]
      );

      if (alunoResult.rows.length > 0) {
        const alunoId = alunoResult.rows[0].id;
        const avisosIds = avisos.map((a: Aviso) => a.id);
        
        if (avisosIds.length > 0) {
          const lidosResult = await pool.query(
            `SELECT aviso_id FROM tb_avisos_lidos WHERE aluno_id = $1 AND aviso_id = ANY($2::int[])`,
            [alunoId, avisosIds]
          );
          
          const avisosLidosIds = new Set(lidosResult.rows.map((r: any) => r.aviso_id));
          avisos = avisos.map((aviso: Aviso) => ({
            ...aviso,
            lido: avisosLidosIds.has(aviso.id)
          }));
        }
      }
    }

    res.json({ avisos });
  } catch (error) {
    console.error('Erro ao listar avisos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Marcar aviso como lido (apenas alunos)
export const marcarAvisoComoLido = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const usuarioId = req.usuario?.id;
    const tipoUsuario = req.usuario?.tipo_usuario;
    const avisoId = parseInt(req.params.id || '')

    if (tipoUsuario !== 'aluno') {
      res.status(403).json({ error: 'Apenas alunos podem marcar avisos como lidos' });
      return;
    }

    const alunoResult = await pool.query(
      'SELECT id FROM tb_usr_alunos WHERE usuario_id = $1',
      [usuarioId]
    );

    if (alunoResult.rows.length === 0) {
      res.status(404).json({ error: 'Aluno não encontrado' });
      return;
    }

    const alunoId = alunoResult.rows[0].id;

    const avisoResult = await pool.query(
      'SELECT id FROM tb_avisos WHERE id = $1 AND ativo = true',
      [avisoId]
    );

    if (avisoResult.rows.length === 0) {
      res.status(404).json({ error: 'Aviso não encontrado' });
      return;
    }

    await pool.query(
      `INSERT INTO tb_avisos_lidos (aviso_id, aluno_id)
       VALUES ($1, $2)
       ON CONFLICT (aviso_id, aluno_id) DO NOTHING`,
      [avisoId, alunoId]
    );

    res.json({ message: 'Aviso marcado como lido' });
  } catch (error) {
    console.error('Erro ao marcar aviso como lido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const contarAvisosNaoLidos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const usuarioId = req.usuario?.id;
    const tipoUsuario = req.usuario?.tipo_usuario;

    if (tipoUsuario !== 'aluno') {
      res.json({ count: 0 });
      return;
    }

    const alunoResult = await pool.query(
      'SELECT id FROM tb_usr_alunos WHERE usuario_id = $1',
      [usuarioId]
    );

    if (alunoResult.rows.length === 0) {
      res.json({ count: 0 });
      return;
    }

    const alunoId = alunoResult.rows[0].id;

    const result = await pool.query(
      `SELECT COUNT(*) as count
       FROM tb_avisos a
       WHERE a.ativo = true
       AND a.id NOT IN (
         SELECT aviso_id FROM tb_avisos_lidos WHERE aluno_id = $1
       )`,
      [alunoId]
    );

    const count = parseInt(result.rows[0].count);
    res.json({ count });
  } catch (error) {
    console.error('Erro ao contar avisos não lidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const deletarAviso = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const usuarioId = req.usuario?.id;
    const avisoId = parseInt(req.params.id || '');

    const avisoResult = await pool.query(
      'SELECT autor_id FROM tb_avisos WHERE id = $1',
      [avisoId]
    );

    if (avisoResult.rows.length === 0) {
      res.status(404).json({ error: 'Aviso não encontrado' });
      return;
    }

    const autorId = avisoResult.rows[0].autor_id;

    if (autorId !== usuarioId && req.usuario?.tipo_usuario !== 'admin') {
      res.status(403).json({ error: 'Você não tem permissão para deletar este aviso' });
      return;
    }

    await pool.query(
      'UPDATE tb_avisos SET ativo = false WHERE id = $1',
      [avisoId]
    );

    res.json({ message: 'Aviso deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar aviso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};