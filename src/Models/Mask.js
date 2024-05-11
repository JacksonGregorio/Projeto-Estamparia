import mongoose from 'mongoose';

const MaskSchema = new mongoose.Schema({
    mask_Type: {type: String, required: true},
    mask_Name: {type: String, required: true},
    mask_Available: {type: Boolean, required: true},
    mask_Description: {type: String, required: true},
    mask_Categories: {type: String, required: true},
    mask_Price: {type: Number},
    mask_Image: {type: String},
    mask_Shirt_Colar: {type: String},
    mask_Shirt_Cloth: {type: String},
});



const Mask = mongoose.model('Mask', MaskSchema);

export default Mask;