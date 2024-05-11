import Movement from "../Models/Movement.js";
import Material from "../Models/Material.js";

class MovementController{

    static listMovements = async (req, res) => {
        try {
            const movements = await Movement.find();
            res.status(200).json(movements);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static getMovement = async (req, res) => {
        try {
            const movement = await Movement.findById(req.params.id);
            res.status(200).json(movement);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static getMovementsByProductWithMaterial = async (req, res) => {
        const product_ID = req.params.product_ID;

        try {
            const movements = await Movement.find({ product_ID }).populate('material_ID');
            res.status(200).json(movements);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static createMovement = async (req, res) => {
        const user_ID = req.user._id;
        const product_ID = req.params.product_ID;

        const {material_ID, material_Amount, movement_Type } = req.body;
    
        if( !material_ID || !material_Amount || !user_ID || !movement_Type){
            return res.status(422).json({message: "Todos os campos são necessários"})
        }

        const material = await Material.findById(material_ID);
        if (!material) {
            return res.status(404).json({message: "Material não encontrado"});
        }

        if (movement_Type == 1) {
            if(!product_ID){
                return res.status(422).json({message: "product_ID é requerido para movimentação de saida de material"})
            }
            if (material.material_Stock < material_Amount) {
                return res.status(400).json({message: "Estoque insuficiente"});
            }
            material.material_Stock -= material_Amount;
        } else if (movement_Type == 2) {
            material.material_Stock += material_Amount;
        } else {
            return res.status(400).json({message: "Tipo de movimentação invalida"});
        }

        try {
            await material.save();
        } catch (err) {
            return res.status(500).json({message: "Erro ao atualizar o seu estoque", error: err});
        }
    
        const newMovement = new Movement({
            product_ID,
            material_ID,
            material_Amount,
            user_ID,
            movement_Type,
        });
    
        try {
            const savedMovement = await newMovement.save();
            res.send(savedMovement);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    static updateMovement = async (req, res) => {
        try {
            const movement = await Movement.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(movement);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static deleteMovement = async (req, res) => {
        try {
            await Movement.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Movimento deletetado com sucesso' });
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static getMovementsBy = async (req, res) => {
        const query = {};
    
        for (let key in req.body) {
            if (Movement.schema.paths[key]) {
                query[key] = req.body[key];
            }
        }
    
        const movements = await Movement.find(query);
    
        res.status(200).json(movements);
    }

    static getMovementsByProduct = async (req, res) => {
        const { Product_ID, startDate, endDate } = req.body;

        if(!Product_ID || !startDate || !endDate){
            return res.status(422).json({message: "data inicial e data final são requeridos"})
        }

        try {
            const movements = await Movement.find({
                Product_ID,
                movement_CreatedAt: {
                    $gte: new Date(startDate),
                    $lt: new Date(endDate)
                }
            });

            let totalAmount = 0;
            movements.forEach(movement => {
                totalAmount += movement.material_Amount;
            });

            res.status(200).json({ totalAmount });
        } catch (err) {
            res.status(500).json(err);
        }
    }

}

export default MovementController;