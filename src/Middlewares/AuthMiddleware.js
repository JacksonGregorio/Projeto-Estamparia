import jwt from 'jsonwebtoken';
import User from '../Models/User.js';
import jsonSecret from '../Config/jsonSecret.js';

async function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: 'token não providenciado' });
    }

    try {
        const decoded = jwt.verify(token, jsonSecret.secret);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'usuário não encontrado' });
        }

        req.user = user;

        next();
    } catch (err) {
        res.status(500).json({ message: 'Falha ao autentificar o token usuário' });
    }
}

export default authMiddleware;