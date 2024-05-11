import Client from "../Models/Client.js";
import CheckDoc from "../Services/CheckDocument.js";

class ClientController{

    static listClients = async (req, res) => {
        try {
            const clients = await Client.find();
            res.status(200).json(clients);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static getClient = async (req, res) => {
        try {
            const client = await Client.findById(req.params.id);
            res.status(200).json(client);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static createClient = async (req, res) => {
        const { client_Type, client_Name, client_Address, client_Email, client_CEP, client_CNPJ_CPF, client_Tel1, client_Tel2 } = req.body;
    
        if(!client_Type || !client_Name || !client_Address || !client_Email || !client_CEP || !client_CNPJ_CPF || !client_Tel1){
            return res.status(422).json({message: "Todos os campos são necessários"})
        }

        if (client_CNPJ_CPF.length === 11) {
            if(!CheckDoc.validateCPF    (client_CNPJ_CPF)){
                return res.status(422).json({message: "invalido cpf"})
            }
        } else if (client_CNPJ_CPF.length === 18) {
            if(!CheckDoc.validateCNPJ(client_CNPJ_CPF)){
                return res.status(422).json({message: "invalido cnpj"})
            }
        } else {
            return res.status(422).json({message: "tamanho invalido CPF ou CNPJ"})
        }

        const newClient = new Client({
            client_Type,
            client_Name,
            client_Address,
            client_Email,
            client_CEP,
            client_CNPJ_CPF,
            client_Tel1,
            client_Tel2
        });
    
        try {
            const savedClient = await newClient.save();
            res.send(savedClient);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    static updateClient = async (req, res) => {
        try {
            const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(client);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static deleteClient = async (req, res) => {
        try {
            await Client.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Cliente delateado com sucesso' });
        } catch (err) {
            res.status(500).json(err);
        }
    }
    
    static getClientBy = async (req, res) => {
        const query = {};
    
        for (let key in req.body) {
            if (Client.schema.paths[key]) {
                query[key] = req.body[key];
            }
        }
    
        const clients = await Client.find(query);
    
        res.send(clients);
    }

}

export default ClientController;