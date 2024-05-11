import mongoose from 'mongoose';

const MovementSchema = new mongoose.Schema({
  product_ID: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  material_ID: {type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true},
  material_Amount: {type: Number, required: true},
  user_ID: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  movement_Type: {type: Number, required: true},
  movement_CreatedAt: {type: Date, default: Date.now}
});

const Movement = mongoose.model('Movement', MovementSchema);

export default Movement;