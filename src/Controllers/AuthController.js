import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import jsonSecret from "../Config/jsonSecret.js";

class AuthController {

    static async login(req, res) {

        const { user_Email, Password } = req.body;

        if (!Password || !user_Email) {
            return res.status(422).json({ message: "Todos os campos são necessários" });
        }

        const user = await User.findOne({ user_Email: user_Email });

        if (!user) {
            return res.status(404).json({ message: "Email não encontrado" });
        }

        const checkPassword = await bcrypt.compare(Password, user.Password);

        if (!checkPassword) {
            return res.status(404).json({ message: "Password invalido" });
        }

        try {
            const secret = jsonSecret.secret;

            const token = Jwt.sign({
                id: user.id,
            },
            secret,
            {
                expiresIn: 86400
            });
            res.setHeader('Access-Control-Expose-Headers', 'Authorization');
            res.setHeader('Authorization', 'Bearer ' + token);
            res.status(200).json({ message: 'Autentificado com sucesso', "Authorization": token , user_Email: user.user_Email, user_Type: user.user_Type, user_Name: user.user_Name });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default AuthController;