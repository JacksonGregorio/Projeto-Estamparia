import express  from "express";
import db from "./Config/dbConnection.js";
import routes from "./Routes/index.js";

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connectado a database");
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

export default app;