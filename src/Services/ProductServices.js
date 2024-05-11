import Product from '../Models/Product.js';
import bucket from '../Config/dbFireConnection.js';
import Order from '../Models/Order.js';

class ProductServices {

    static deleteOrderProduct = async(order_ID) => {
        
        try {
            const products = await Product.find({ order_ID: order_ID });
            for (let product of products) {
                this.deleteProductByIdImages(product._id);
            }
            await Product.deleteMany({ order_ID: order_ID });
            return true;
        } catch (err) {
            return false;
        }
    }

    static attProductState = async(order_ID) =>{
        try{
            const order = await Order.findById({ _id: order_ID });
            if(order.order_Payment/2 >= order.order_Price){
                order.order_State = "Semi-Pago";
                await order.save();
                const products = await Product.find({order_ID: order_ID});
                for(let product of products){
                    product.product_State = "Em Espera";
                    product.save();
                }
                return true;
            }else if(order.order_Payment === order.order_Price){
                order.order_State = "Pago";
                await order.save();
                const products = await Product.find({order_ID: order_ID});
                for(let product of products){
                    product.product_State = "Em Espera";
                    product.save();
                }
            }
        }catch(err){
            return console.error(err);
        }
    }

    static checkAndUpdateOrderState = async(order_ID) => {
        try {
            const order = await Order.findById(order_ID);
            const products = await Product.find({ order_ID: order._id });
            const allProductsFinished = products.every(product => product.product_State === "Finalizado");
    
            if (allProductsFinished) {
                order.order_State = "Concluída";
                await order.save();
                res.status(200).json({message: `Order ${order._id} foi atualizda para "Concluída"`});
            }
    
            res.status(200).json({ message: "Ordem atualizada com sucesso" });
        } catch (err) {
            return false;
        }
    }

    static deleteProductByIdImages = async(product_ID) => {
        try {
                const destinationImage = 'Estamparia/Image' + product_ID.toString();
                const destinationPrint = 'Estamparia/Print' + product_ID.toString();
    
                await bucket.file(destinationImage).delete();
                await bucket.file(destinationPrint).delete();
                return true;
        }catch (err) {
            return console.error(err);
        }
    }

    static deleteMaskByIdImages = async(mask_ID) => {
        try {
            const destinationImage = 'Estamparia/Mask' + mask_ID.toString();
    
            await bucket.file(destinationImage).delete();
            return true;
        } catch (err) {
            return console.error(err);
        }
    }

}

export default ProductServices;