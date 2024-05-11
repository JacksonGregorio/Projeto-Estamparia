import Payment from "../Models/Payment.js";
import Order from "../Models/Order.js";
import ProductServices from "../Services/ProductServices.js";

class PaymentController{

    static listPayments = async (req, res) => {
        try {
            const payments = await Payment.find();
    
            res.status(200).json(payments);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static getPayment = async (req, res) => {
        try {
            const payment = await Payment.findById(req.params.id);
            res.status(200).json(payment);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static createPayment = async (req, res) => {
        const order_ID = req.params.order_ID;
        const user_ID = req.user._id;


        const order = await Order.findById(order_ID);
            if (!order) {
            return res.status(404).json({message: "Order não encontrado"});
        }

        const client_ID = order.client_ID;

        const {payment_Amount, payment_Method } = req.body;

    
        if(!order_ID || !user_ID || !client_ID || !payment_Amount){
            return res.status(422).json({message: "Todos os campos são necessários"})
        }
    
        const newPayment = new Payment({
            order_ID,
            user_ID,
            client_ID,
            payment_Amount,
            payment_Method
        });
    
        try {
            const savedPayment = await newPayment.save();
        
            const order = await Order.findById(order_ID);
            if (!order) {
                return res.status(404).json({message: "Order não encontrado"});
            }
        
            let change = 0;
            let amountToBePaid = order.order_Price - order.order_Payment;
        
            if (payment_Amount > amountToBePaid) {
                change = payment_Amount - amountToBePaid;
                order.order_Payment += amountToBePaid;
            } else {
                order.order_Payment += payment_Amount;
            }
            await order.save();

            const ProductStatus = await ProductServices.attProductState(order_ID);
            if (!ProductStatus) {
                return res.status(404).json({message: "Falha ao atualizr o produto"});
            }
            
            res.send({ savedPayment, change });
        } catch (err) {
            res.status(400).send(err);
        }
    }

    static updatePayment = async (req, res) => {
        try {
            const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(payment);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static deletePayment = async (req, res) => {
        try {
            await Payment.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Pagamento deleteda com sucesso'});
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static getPaymentsBy = async (req, res) => {
        const query = {};

        for (let key in req.body) {
            if (Payment.schema.paths[key]) {
                query[key] = req.body[key];
            }
        }
    
        const payments = await Payment.find(query);

        res.status(200).json(payments);
    }

    static getPaymentsByDate = async (req, res) => {
        const { date } = req.body;
    
        const start = new Date(date);
        const end = new Date(date);
        end.setDate(end.getDate() + 1);
    
        const query = {
            payment_Date: {
                $gte: start,
                $lt: end
            }
        };
    
        for (let key in req.body) {
            if (key !== 'date' && Payment.schema.paths[key]) {
                query[key] = req.body[key];
            }
        }
    
        const payments = await Payment.find(query);
    

        res.status(200).json(payments);
    }

}


export default PaymentController;