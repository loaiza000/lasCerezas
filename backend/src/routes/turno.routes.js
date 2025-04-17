import { Router } from "express";
import turnoController from "../controllers/turno.controller.js";

const turnoRouter = Router();

turnoRouter.get("/", turnoController.getAllTurnos);
turnoRouter.get("/:id", turnoController.getTurnoById);
turnoRouter.get("/numero/:turno", turnoController.getTurnoByTurno);
turnoRouter.get("/pendientes", turnoController.getTurnoByPendiente);
turnoRouter.get("/estado/:estado", turnoController.getTurnosByEstado);
turnoRouter.post("/", turnoController.postTurno);
turnoRouter.put("/:id", turnoController.putTurno);
turnoRouter.delete("/:id", turnoController.deleteTurno);

export default turnoRouter;
