import mongoose from 'mongoose';

const SupplierSchema = new mongoose.Schema({
  supplier_Tel1: {type: String, required: true},
  supplier_Tel2: {type: String, required: false},
  supplier_CEP: {type: String, required: true},
  supplier_Address: {type: String, required: true},
  supplier_Agent: {type: String, required: true},
  supplier_Email: {type: String, required: true},
  supplier_Name: {type: String, required: true},
  supplier_CNPJ: {type: String, required: true, unique: true},
  supplier_Social_Order: {type: String, required: true}
});

const Supplier = mongoose.model('Supplier', SupplierSchema);

export default Supplier;