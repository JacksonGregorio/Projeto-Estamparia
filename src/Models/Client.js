import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  client_Type: {type: String, required: true},
  client_Name: {type: String, required: true},
  client_Address: {type: String, required: true},
  client_Email: {type: String, required: true},
  client_CEP: {type: String, required: true},
  client_CNPJ_CPF: {type: String, required: true},
  client_Tel1: {type: String, required: true},
  client_Tel2: {type: String, required: false},
  client_Birthday: {type: Date, required: false},
});

const Client = mongoose.model('Client', ClientSchema);

export default Client;