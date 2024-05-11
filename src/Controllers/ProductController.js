import Product from "../Models/Product.js";
import multer from 'multer';
import bucket from '../Config/dbFireConnection.js';
import ProductServices from "../Services/ProductServices.js";
import Order from "../Models/Order.js";
import Mask from "../Models/Mask.js";

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });


class ProductController{

  static upload = upload;

    static listProducts = async (req, res) => {
        try {
            const products = await Product.find();
            res.status(200).json(products);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static getProduct = async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            res.status(200).json(product).populate('product_Mask');
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static getProductsByOrderId = async (req, res) => {
      try {
          const products = await Product.find({ order_ID: req.params.id });
          res.status(200).json(products);
      } catch (err) {
          res.status(500).json(err);
      }
  }

  static updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const order = await Order.findById(product.order_ID);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const discountedPriceOne = product.product_Amount_Price - (product.product_Amount_Price * (order.order_Discount / 100));

        order.order_Price -= discountedPriceOne;

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

        const discountedPriceTwo = updatedProduct.product_Amount_Price - (updatedProduct.product_Amount_Price * (order.order_Discount / 100));

        order.order_Price += discountedPriceTwo;

        await order.save();

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
  }

    static deleteProduct = async (req, res) => {
      try {
          const product = await Product.findById(req.params.id);
          if (!product) {
              return res.status(404).json({ message: 'Produto não encontrado' });
          }
          const order = await Order.findById(product.order_ID);
          if (!order) {
            const ProductDeleted = await ProductServices.deleteProductByIdImages(req.params.id);
            if (!ProductDeleted) {
              return res.status(404).json({ message: 'Falha ao Deletar ptoduto' });
            }
            await Product.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Produto deletado com sucesso' });
          }

          const discountedPrice = product.product_Amount_Price - (product.product_Amount_Price * (order.order_Discount / 100));
  
          order.order_Price -= discountedPrice;
          await order.save();
  
          await Product.findByIdAndDelete(req.params.id);
          const ProductDeleted = await ProductServices.deleteProductByIdImages(req.params.id);
            if (!ProductDeleted) {
              return res.status(404).json({ message: 'Falha ao Deletar ptoduto' });
            }
          res.status(200).json({ message: 'Produto deletado com sucesso' });
      } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
  }

    static getProductsBy = async (req, res) => {
        const query = {};
    
        for (let key in req.body) {
            if (Product.schema.paths[key]) {
                query[key] = req.body[key];
            }
        }
    
        const products = await Product.find(query);
    
        res.send(products);
    }

    //add services

    static createProduct = async (req, res) => {

      const order_ID = req.params.order_ID;
      const { product_Type, product_Description, product_Unit_Price, product_Amount_Price, 
      product_Amount, product_Delivered, product_Color, product_Mask, product_Technique, product_Observation
      } = req.body;

      if(!order_ID || !product_Type || !product_Description || !product_Unit_Price || !product_Amount_Price || 
        !product_Amount){
        return res.status(422).json({message: "Todos os campos são necessários"})
      }

      const order = await Order.findById(order_ID);
      const mask = await Mask.findById(product_Mask);
      if (!order || !mask) {
        return res.status(404).json({message: "Order ou mascara não encontrado"});
      }

      let discountedPrice;

      if(mask.mask_Price){

      let product_Total_Price = Number(product_Amount_Price) + (Number(product_Amount_Price) * (Number(mask.mask_Price) / 100));
      
      discountedPrice = product_Total_Price - (product_Total_Price * (order.order_Discount / 100));

      }else{

      discountedPrice = product_Amount_Price - (product_Amount_Price * (order.order_Discount / 100));

      }
      
      const newProduct = new Product({
        order_ID,
        product_Type,
        product_Description,
        product_Unit_Price,
        product_Color,
        product_Mask,
        product_Technique,
        product_Amount_Price,
        product_Amount,
        product_Delivered,
        product_Observation
      });
    
      try {
        const savedProduct = await newProduct.save();

        order.order_Price += discountedPrice;
        await order.save();
    
        const destinationImage = 'Estamparia/Image' + savedProduct._id.toString();
        const destinationPrint = 'Estamparia/Print' + savedProduct._id.toString();
    
        const blobImage = bucket.file(destinationImage);
        const streamImage = blobImage.createWriteStream({
          metadata: {
            contentType: req.files.product_Image[0].mimetype,
          },
        });
        streamImage.end(req.files.product_Image[0].buffer);
    
        const blobPrint = bucket.file(destinationPrint);
        const streamPrint = blobPrint.createWriteStream({
          metadata: {
            contentType: req.files.product_Print[0].mimetype,
          },
        });
        streamPrint.end(req.files.product_Print[0].buffer);
    
        const config = {
          action: 'read',
          expires: '03-09-2491',
        };
    
        blobImage.getSignedUrl(config, async (err, urlImage) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
    
          savedProduct.product_Image = urlImage;
    
          blobPrint.getSignedUrl(config, async (err, urlPrint) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
    
            savedProduct.product_Print = urlPrint;
    
            try {
              const updatedProduct = await savedProduct.save();
              return res.send(updatedProduct);
            } catch (err) {
              console.error(err);
            }
          });
        });
        const ProductStatus = await ProductServices.attProductState(order_ID);
            if (ProductStatus) {
              console.log(ProductStatus);
            }
      } catch (err) {
        console.error(err);
      }
    }

}

export default ProductController;

