CREATE TABLE IF NOT EXISTS tb_avisos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    autor_id INTEGER REFERENCES tb_usuarios(id),
    tipo VARCHAR(50) DEFAULT 'geral' CHECK (tipo IN ('geral', 'lembrete', 'institucional')),
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP DEFAULT NOW(),
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS tb_avisos_lidos (
    id SERIAL PRIMARY KEY,
    aviso_id INTEGER REFERENCES tb_avisos(id) ON DELETE CASCADE,
    aluno_id INTEGER REFERENCES tb_usr_alunos(id) ON DELETE CASCADE,
    lido_em TIMESTAMP DEFAULT NOW(),
    UNIQUE(aviso_id, aluno_id)
);

CREATE INDEX IF NOT EXISTS idx_avisos_autor ON tb_avisos(autor_id);
CREATE INDEX IF NOT EXISTS idx_avisos_criado_em ON tb_avisos(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_avisos_ativo ON tb_avisos(ativo);
CREATE INDEX IF NOT EXISTS idx_avisos_lidos_aviso ON tb_avisos_lidos(aviso_id);
CREATE INDEX IF NOT EXISTS idx_avisos_lidos_aluno ON tb_avisos_lidos(aluno_id);