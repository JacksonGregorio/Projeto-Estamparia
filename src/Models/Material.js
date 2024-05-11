import mongoose from 'mongoose';

const MaterialSchema = new mongoose.Schema({
  supplie_ID: {type: mongoose.Schema.Types.ObjectId, ref: 'Supplier',required: true, required: true},
  material_Name: {type: String, required: true},
  material_ID_Batch: {type: String},
  material_Last_Price: {type: Number, required: true},
  material_Stock: {type: Number, required: true},
  material_Limit_Stock: {type: Number, required: true},
  material_Storage_Location: {type: String, required: true},
  material_Description: {type: String, required: true},
  material_Last_Att_Date: {type: Date, default: Date.now},
  material_Purchased_Date: {type: Date, default: Date.now, required: true}
});

const Material = mongoose.model('Material', MaterialSchema);

export default Material;