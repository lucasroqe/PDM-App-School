import { Router } from "express";
import { login } from "../controllers/authController";

const router = Router();

router.get('/', (req, res) => {
    res.send('Rota de autenticação');
});

router.post('/login', login);

export default router;