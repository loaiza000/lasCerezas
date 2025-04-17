import { Router } from "express";
import pagoController from "../controllers/pago.controller.js";

const pagoRouter = Router();

pagoRouter.get("/", pagoController.getAllPagos);
pagoRouter.get("/:id", pagoController.getPagoById);
pagoRouter.get("/pagoByTurno", pagoController.getPagoByTurno);
pagoRouter.get("/pagosByMetodo/:metodo", pagoController.getPagosByMetodo);

export default pagoRouter;
