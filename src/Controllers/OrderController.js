import Order from "../Models/Order.js";
import Client from "../Models/Client.js";
import Product from "../Models/Product.js";
import Payment from "../Models/Payment.js";
import ProductServices from "../Services/ProductServices.js";
import xlsx from 'xlsx';



class OrderController{

    static listOrders = async (req, res) => {
        try {
            const orders = await Order.find();
    
            res.status(200).json(orders);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static listOrdersWithClient = async (req, res) => {
        try {
            const orders = await Order.find().populate('client_ID');;
    
            res.status(200).json(orders);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static getOrder = async (req, res) => {
        try {
            const order = await Order.findById(req.params.id).populate(['client_ID', 'user']);
    
            res.status(200).json(order);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static createOrder = async (req, res) => {
        const client_ID = req.params.client_ID;
        const user_ID = req.user._id;
    
        let { order_State, order_Expired, order_Discount} = req.body;

        order_Expired = new Date(order_Expired).toISOString();
    
        if(!user_ID || !order_State || !order_Expired || !client_ID){
            return res.status(422).json({message: "Todos os campos são necessários"})
        }
    
        const newOrder = new Order({
            user_ID,
            order_State,
            order_Expired,
            client_ID,
            order_Discount
        });
        try {
            const savedOrder = await newOrder.save();
            res.send(savedOrder);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    static updateOrder = async (req, res) => {
        try {
            const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(order);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static deleteOrder = async (req, res) => {

        const order_ID = req.params.id;
        try {

            const ProductStatus = await ProductServices.deleteOrderProduct(order_ID);
            if (!ProductStatus) {
                return res.status(404).json({message: "Falha ao atualizr o produto"});
            }
            await Order.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Ordem deleteda com sucesso'});

        } catch (err) {
            res.status(500).json(err);
        }
    }

    static deleteOrderProducts = async (req, res) => {

        const order_ID = req.params.id;

        try {
            const ProductStatus = await ProductServices.deleteOrderProduct(order_ID);
            if (!ProductStatus) {
                return res.status(404).json({message: "Falha ao atualizr o produto"});
            }
            res.status(200).json({ message: 'Produtos deletedos com sucesso'}); 

        } catch (err) {
            res.status(500).json(err);
        }
    }

    static getOrdersBy = async (req, res) => {
        const query = {};
    
        for (let key in req.body) {
            if (Order.schema.paths[key]) {
                query[key] = req.body[key];
            }
        }
    
        const orders = await Order.find(query);

        res.status(200).json(orders);
    }
    
    static getOrdersByDate = async (req, res) => {
        const { date } = req.body;
    
        const start = new Date(date);
        const end = new Date(date);
        end.setDate(end.getDate() + 1);
    
        const query = {
            order_Date: {
                $gte: start,
                $lt: end
            }
        };
    
        for (let key in req.body) {
            if (key !== 'date' && Order.schema.paths[key]) {
                query[key] = req.body[key];
            }
        }
        const orders = await Order.find(query);

        res.status(200).json(orders);
    }

    static getUserOrdersPriceLastMonth = async (req, res) => {

        const start = new Date();
        start.setDate(start.getDate() - 30);
    
        const query = {
            user_ID: req.user._id,
            order_createdAt: {
                $gte: start
            }
        };

        const orders = await Order.find(query);
    
        const total = orders.reduce((acc, order) => acc + order.order_Price, 0);
    
        res.send({ total });
    }

    static getUserOrdersPriceLast30Days = async (req, res) => {

        const start = new Date();
        start.setDate(start.getDate() - 30);
    
        const query = {
            user_ID: req.user._id,
            order_createdAt: {
                $gte: start
            }
        };
    
        const orders = await Order.find(query);
    
        const total = orders.reduce((acc, order) => acc + order.order_Price, 0);
    
        res.send({ total });
    }

    static getUserOrdersPriceLastWeek = async (req, res) => {
        const start = new Date();
        start.setDate(start.getDate() - 7);
    
        const query = {
            user_ID: req.user._id,
            order_createdAt: {
                $gte: start
            }
        };
    
        const orders = await Order.find(query);
    
        const total = orders.reduce((acc, order) => acc + order.order_Price, 0);
    
        res.send({ total });
    }

    static getUserOrdersPriceLastWeekGraph = async (req, res) => {
        const today = new Date();
        const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    
        const orders = await Order.find({
            user_ID: req.user.id,
            order_createdAt: { $gte: lastWeek }
        });
    
        const dailyTotals = Array(7).fill(0).map((_, i) => {
            const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
            const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
            const endOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
    
            return {
                day: day.toISOString().slice(0, 10),
                total: orders.reduce((acc, order) => {
                    const orderDate = new Date(order.order_createdAt);
                    const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
                    if (orderDay >= startOfDay && orderDay < endOfDay) {
                        return acc + order.order_Price;
                    }
                    return acc;
                }, 0)
            };
        });
    
        res.send(dailyTotals.reverse());
    }

    static getUserOrdersPriceLastMonthGraph = async (req, res) => {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
        const orders = await Order.find({
            user_ID: req.user.id,
            order_createdAt: { $gte: lastMonth }
        });

    
        const dailyTotals = Array(30).fill(0).map((_, i) => {
            const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
            const endOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
    
            return {
                day: day.toISOString().slice(0, 10),
                total: orders.reduce((acc, order) => {
                    const orderDate = new Date(order.order_createdAt);
                    const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
                    if (orderDay >= startOfDay && orderDay < endOfDay) {
                        return acc + order.order_Price;
                    }
                    return acc;
                }, 0)
            };
        });
    
        res.send(dailyTotals.reverse());
    }

    static getOrderBysWithClient = async (req, res) => {
        const query = {};
    
        for (let key in req.query) {
            if (Order.schema.paths[key]) {
                query[key] = req.query[key];
            }
        }
    
        const orders = await Order.find(query).populate('client_ID');

    
        res.status(200).json(orders);
    }

    static getOrdersByClientData = async (req, res) => {
        const query = {};
    
        for (let key in req.body) {
            if (Client.schema.paths[key]) {
                query[key] = req.body[key];
            }
        }
    
        try {
            const client = await Client.findOne(query);
    
            if (!client) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }
    
            const orders = await Order.find({ client_ID: client._id });
    
            res.status(200).json(orders);
    
            res.status(200).json(ordersWithSaoPauloTime);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static getProductsAndOrdersByDate = async (req, res) => {
        const { startDate, endDate } = req.body;
    
        try {
            const products = await Product.find().populate({
                path: 'order_ID',
                match: {
                    order_createdAt: {
                        $gte: new Date(startDate),
                        $lt: new Date(endDate)
                    }
                },
                populate: [
                    { path: 'user_ID' },
                    { path: 'client_ID' }
                ]
            });
    
            const productsWithOrders = products.filter(product => product.order_ID).map(product => {
                return {
                    product: product.toObject(),
                    order: product.order_ID.toObject(),
                    user: product.order_ID.user_ID ? product.order_ID.user_ID.toObject() : null,
                    client: product.order_ID.client_ID ? product.order_ID.client_ID.toObject() : null
                };
            });
    
            const organizedProducts = productsWithOrders.map(product => {
                return {
                    "Produto descrição": product.product.product_Description,
                    "Tipo produto": product.product.product_Type,
                    "Produto preço unitário": product.product.product_Unit_Price,
                    "Produto quantidade": product.product.product_Amount,
                    "Produto preço total": product.product.product_Amount_Price,
                    "Ordem efetuada": product.order.order_createdAt,
                    "Responsavel": product.order.user_ID.user_Name,
                    "Cliente": product.order.client_ID.client_Name
                };
            });
    
            const worksheet = xlsx.utils.json_to_sheet(organizedProducts);
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Products');
    
            const buffer = xlsx.write(workbook, { type: 'buffer' });
    
            res.setHeader('Content-Disposition', 'attachment; filename=ProductsAndOrders.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
            res.send(buffer);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

export default OrderController;