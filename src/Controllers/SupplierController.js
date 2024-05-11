import Supplier from "../Models/Supplier.js";
import CheckDoc from "../Services/CheckDocument.js";

class SupplierController{

    static listSuppliers = async (req, res) => {
        try {
            const suppliers = await Supplier.find();
            res.status(200).json(suppliers);
        } catch (err) {
            res.status(500).json(err);
        }               
    }

    static getSupplier = async (req, res) => {
        try {
            const supplier = await Supplier.findById(req.params.id);
            res.status(200).json(supplier);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static createSupplier = async (req, res) => {
        const { supplier_Tel1, supplier_Tel2, supplier_CEP, supplier_CNPJ, supplier_Address, supplier_Agent, supplier_Email, supplier_Name, supplier_Social_Order} = req.body;
    
        if(!supplier_Name || !supplier_Email || !supplier_Address || !supplier_CEP || !supplier_Agent || !supplier_Social_Order || !supplier_CNPJ){
            return res.status(422).json({message: "Todos os campos são necessários"})
        }
    
        function validateEmail(supplier_Email) {
            var re = /\S+@\S+.\S+/;
            return re.test(supplier_Email);
        }
    
        if(!validateEmail(supplier_Email)){
            return res.status(422).json({message: "Email não valido"})
        }

        if(!CheckDoc.validateCNPJ(supplier_CNPJ)){
            return res.status(422).json({message: "invalido CNPJ"})
        }
    
        const emailExist = await Supplier.findOne({supplier_Email})
    
        if(emailExist){
            return res.status(422).json({message: "Email já cadastrado"})
        }

        const newSupplier = new Supplier({
            supplier_Tel1,
            supplier_Tel2,
            supplier_CEP,
            supplier_Address,
            supplier_Agent,
            supplier_Email,
            supplier_CNPJ,
            supplier_Name,
            supplier_Social_Order
        });
    
        try {
            const savedSupplier = await newSupplier.save();
            res.send(savedSupplier);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    static updateSupplier = async (req, res) => {
        try {
            const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(supplier);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static deleteSupplier = async (req, res) => {
        try {
            await Supplier.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Fornecedor deletado com sucesso' });
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static getSuppliersBy = async (req, res) => {
        const query = {};
    
        for (let key in req.body) {
            if (Supplier.schema.paths[key]) {
                query[key] = req.body[key];
            }
        }
    
        const suppliers = await Supplier.find(query);
    
        res.send(suppliers);
    }
}

export default SupplierController;
