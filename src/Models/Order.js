import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    user_ID: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
    order_Price: {type: Number, default: 0},
    order_Payment: {type: Number, default: 0},
    order_State: {type: String,required: true},
    order_Discount: {type: Number,default: 0},
    order_Expired: {type: Date,required: true},
    client_ID: {type: mongoose.Schema.Types.ObjectId,ref: 'Client',required: true},
    order_createdAt: {type: Date, default: Date.now},
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;
