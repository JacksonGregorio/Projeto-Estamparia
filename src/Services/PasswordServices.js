import crypto from 'crypto';
import User from '../Models/User.js';
import bcrypt from "bcryptjs";

class PasswordService {

    static async forgotPassword(req, res) {
        const { user_Email } = req.body;

        try {
            const user = await User.findOne({ user_Email });

            if (!user) {
                return res.status(404).json({ message: 'Usuário com este Email Não encontrado ' });
            }

            const token = crypto.randomBytes(20).toString('hex');

            user.Password_Token = token;
            user.Password_Refresh = Date.now() + 36000; 

            await user.save();

            res.status(200).json({ 
                message: 'Password token de criado', 
                Password_Token: user.Password_Token, 
                Password_Refresh: user.Password_Refresh 
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    }

    static async resetPassword(req, res) {
        const  token  = req.params.token;
        const { newPassword } = req.body;

        try {
            const user = await User.findOne({Password_Token:token});

            if (!user) {
                return res.status(400).json({ message: "Seu token para resetar a senha não é valido" });
            }

            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            user.Password = hashedPassword;


            await user.save();

            res.status(200).json({ message: 'Password resetado com sucesso'});
        } catch (err) {
            res.status(500).send(err);
        }
    }
}

export default PasswordService;