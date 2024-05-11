import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  user_Type: {type: Number,},
  user_NickName: {type: String, unique: true},
  user_Name: {type: String,},
  user_Email: {type: String, unique: true},
  user_State: {type: Boolean,},
  user_cpf: {type: String,unique: true},
  user_Tel1: {type: String, required: false},
  user_Tel2: {type :String, required: false},
  Password: {type: String},
  Password_Token: {type :String},
  Password_Refresh: {type :Date},
});

UserSchema.set('toJSON', {
    transform: function (doc, ret) {
      delete ret.Password;

      switch (ret.user_Type) {
        case 1:
          ret.user_Type = 'Atendente';
          break;
        case 2:
          ret.user_Type = 'Operador';
          break;
        case 3:
          ret.user_Type = 'Gerente';
          break;
        case 4:
          ret.user_Type = 'Administrador';
          break;
        default:
          break;
      }

      if(ret.user_State){
        ret.user_State = 'ativo';
      }else{
        ret.user_State = 'inativo';
      }
  }
});


export default mongoose.model('User', UserSchema);
