export interface Usuario {
  id: number;
  email: string;
  senha_hash: string;
  tipo_usuario: 'aluno' | 'professor';
  criado_em: Date;
}

export interface Aluno {
  id: number;
  usuario_id: number;
  nome: string;
  matricula: string;
  curso: string;
  ativo: boolean;
}

export interface Professor {
  id: number;
  usuario_id: number;
  nome: string;
  titulacao?: string;
  tempo_docencia?: number;
}

export interface Disciplina {
  id: number;
  nome: string;
  carga_horaria: number;
  professor_id: number;
  ativa: boolean;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    email: string;
    tipo_usuario: string;
    nome: string;
  };
}

export interface CadastroAlunoRequest {
  email: string;
  senha: string;
  nome: string;
  matricula: string;
  curso: string;
}

export interface CadastroProfessorRequest {
  email: string;
  senha: string;
  nome: string;
  titulacao?: string;
  tempo_docencia?: number;
}

export interface CadastroDisciplinaRequest {
  nome: string;
  carga_horaria: number;
  professor_id: number;
}

export interface BoletimItem {
  disciplina_id: number;
  disciplina_nome: string;
  carga_horaria: number;
  professor_nome: string;
  ano_semestre: string;
  nota1?: number;
  nota2?: number;
  nota3?: number;
  media_final?: number;
  situacao_final: string;
}

export interface BoletimResponse {
  aluno_id: number;
  aluno_nome: string;
  matricula: string;
  curso: string;
  disciplinas: BoletimItem[];
}
