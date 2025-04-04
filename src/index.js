import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./database.js";
connectDB();

import pagoRouter from "./routes/pago.routes.js";
import turnoRouter from "./routes/turno.routes.js";
import usuarioRouter from "./routes/usuario.routes.js";

dotenv.config();

const app = express();

app.set("Port", process.env.PORT);
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/pago", pagoRouter);
app.use("/turno", turnoRouter);
app.use("/usuario", usuarioRouter);

app.listen(app.get("Port"), () => {
  console.log("Escuchando por el puerto", app.get("Port"));
});
