import mongoose from 'mongoose';
import moment from 'moment-timezone';

const PaymentSchema = new mongoose.Schema({
    order_ID: {type: mongoose.Schema.Types.ObjectId,ref: 'Order',required: true},
    user_ID: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
    client_ID: {type: mongoose.Schema.Types.ObjectId,ref: 'Client',required: true},
    payment_Method: {type: String, required: true},
    payment_Amount: {type: Number,required: true},
    payment_Date: {type: Date, default: Date.now},
});



const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;