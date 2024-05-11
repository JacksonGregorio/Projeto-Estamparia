
function roleMiddleware(roles) {
    return function (req, res, next) {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ message: 'Não autorizado' });
        }

        if (!roles.includes(user.user_Type)) {
            return res.status(403).json({ message: 'Acesso pribido para o seu cargo' });
        }

        next();
    }
}

export default roleMiddleware;