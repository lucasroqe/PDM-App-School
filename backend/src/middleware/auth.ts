import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  usuario?: {
    id: number;
    tipo_usuario: string;
  };
}

export const autenticarToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    res.status(401).json({ error: 'Token de acesso requerido' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded: any) => {
    if (err) {
      res.status(403).json({ error: 'Token inválido ou expirado' });
      return;
    }

    req.usuario = {
      id: decoded.id,
      tipo_usuario: decoded.tipo_usuario
    };
    
    next();
  });
};

export const requerirProfessor = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!['professor', 'admin'].includes(req.usuario?.tipo_usuario || '')) {
    res.status(403).json({ error: 'Acesso negado: requer perfil de professor ou admin' });
    return;
  }
  next();
};