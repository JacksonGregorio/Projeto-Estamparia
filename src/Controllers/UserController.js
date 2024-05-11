import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import CheckDoc from "../Services/CheckDocument.js";

class UserController{

    static listUser = async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static getUser = async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static createUser = async (req, res) => {
        const { user_Name, Password, user_Email, ComfirmPassword, user_Type, user_Tel1, user_Tel2, user_cpf, user_State, user_NickName } = req.body;
    
        if(!user_Name || !Password || !user_Email || !ComfirmPassword || !user_Type || !user_cpf || !user_State || !user_NickName){
            return res.status(422).json({message: "Todos os campos são necessários"})
        }
    
        if(ComfirmPassword !== Password){
            return res.status(422).json({message: "Passwords não são iguais"})
        }
    
        function validateEmail(user_Email) {
            var re = /\S+@\S+.\S+/;
            return re.test(user_Email);
        }
    
        if(!validateEmail(user_Email)){
            return res.status(422).json({message: "Email não valido"})
        }
    
        const emailExist = await User.findOne({user_Email})
    
        if(emailExist){
            return res.status(422).json({message: "Email já cadastrado"})
        }

        const nickExist = await User.findOne({ user_NickName });

        if(nickExist){
        return res.status(422).json({message: "NickName já cadastrado"});
        }

        const cpfExist = await User.findOne({ user_cpf });

        if(cpfExist){
        return res.status(422).json({message: "CPF já cadastrado"});
        }

        if(!CheckDoc.validateCPF(user_cpf)){
            return res.status(422).json({message: "Invalido CPF"});
        }
    
        const salt = await bcrypt.genSalt(12)
        const Passwordhash = await bcrypt.hash(Password, salt)
    
        const newUser = new User({
            user_Name,
            Password: Passwordhash,
            user_NickName,
            user_State,
            user_Email,
            user_Type,
            user_Tel1,
            user_Tel2,
            user_cpf,
        });
    
        try {
            const savedUser = await newUser.save();
            res.send(savedUser);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    static updateUser = async (req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static deleteUser = async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Usuário deletado com secesso' });
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static getUsersBy = async (req, res) => {
        const query = {};
    
        for (let key in req.body) {
            if (User.schema.paths[key]) {
                query[key] = req.body[key];
            }
        }
    
        const users = await User.find(query);
    
        res.send(users);
    }

    

}

export default UserController;