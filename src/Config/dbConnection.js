import mongoose from "mongoose";


console.log(process.env.DB_CONNECTION );

mongoose.connect(process.env.DB_CONNECTION);

let db = mongoose.connection;

export default db;