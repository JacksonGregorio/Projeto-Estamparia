import  Jwt  from "jsonwebtoken";
import jsonSecret from "../Config/jsonSecret.js";

async function checkToken(req, res, next) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({message: 'token não encontrado'});
    }

    try {

        const secret = jsonSecret.secret;
        Jwt.verify(token, secret);

        return next();
        
    } catch (error) {
        return res.status(401).json({message:'Usuário não autenticado'});
    }
        
}

export default checkToken;

