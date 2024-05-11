import Material from "../Models/Material.js";

class MaterialController{

    static listMaterials = async (req, res) => {
        try {
            const materials = await Material.find();
            res.status(200).json(materials);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static getMaterial = async (req, res) => {
        try {
            const material = await Material.findById(req.params.id);
            res.status(200).json(material);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static createMaterial = async (req, res) => {
        const newMaterial = new Material(req.body);
    
        try {
            const savedMaterial = await newMaterial.save();
            res.send(savedMaterial);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    static updateMaterial = async (req, res) => {
        try {
            const material = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(material);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static deleteMaterial = async (req, res) => {
        const id = req.params.id;
        try {
            await Material.findByIdAndDelete(id);
            res.status(200).json({ message: 'Material deleteda com sucesso' });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    }

    static getMaterialsBy = async (req, res) => {
        const query = {};
    
        for (let key in req.body) {
            if (Material.schema.paths[key]) {
                query[key] = req.body[key];
            }
        }
    
        const materials = await Material.find(query);
    
        res.send(materials);
    }

    static findLowStockMaterials = async (req, res) => {
        try {
            const materials = await Material.find({ $expr: { $lt: [ "$material_Stock", "$material_Limit_Stock" ] } }).populate('Supplier');
            res.status(200).json(materials);
        } catch (err) {
            res.status(500).json(err);
        }
    }

}

export default MaterialController;