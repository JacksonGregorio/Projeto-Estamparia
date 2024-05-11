import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  order_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  product_Type: { type: String},
  product_State: { type: String, default: "Aguardando Pagamento"},
  product_Image: { type: String },
  product_Print: { type: String },
  product_Text: { type: String },
  product_Color: { type: String },
  product_Mask: { type: mongoose.Schema.Types.ObjectId, ref: 'Mask' },
  product_Observation: { type: String },
  product_Technique: { type: String },
  product_Description: { type: String, required: true},
  product_Unit_Price: { type: Number, required: true},
  product_Amount_Price: { type: Number, required: true },
  product_Amount: { type: Number, required: true},
  product_Delivered: { type: Boolean, default: false }
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;