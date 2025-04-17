import { Router } from "express";
import usuarioController from "../controllers/usuario.controller.js";

const usuarioRouter = Router();

usuarioRouter.get("/", usuarioController.getUsuarios);
usuarioRouter.get("/:id", usuarioController.findUserById);
usuarioRouter.put("/:id", usuarioController.updateUser);
usuarioRouter.delete("/:id", usuarioController.deleteUser);
usuarioRouter.post("/register", usuarioController.registerUser);
usuarioRouter.post("/login", usuarioController.loginUser);

export default usuarioRouter;
