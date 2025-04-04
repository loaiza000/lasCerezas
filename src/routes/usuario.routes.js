import { Router } from "express";
import usuarioController from "../controllers/usuario.controller.js";

const usuarioRouter = Router();

usuarioRouter.get("/", usuarioController.getUsuarios);
usuarioRouter.get("/:id", usuarioController.findUserById);

export default usuarioRouter;
