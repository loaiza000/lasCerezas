import jwt from "jsonwebtoken";
import { response } from "../helpers/response.js";
import { usuarioModel } from "../models/usuario.model.js";

const messageNoAuth = (res) => response(res, 401, false, "No esata autorizado");

export const authClient = (roles = []) => {
  return async (req, res, next) => {
    try {
      let token = req.headers.authorizatio;

      if (!token || !token.startsWith("Bearer ")) {
        return messageNoAuth(res);
      }

      token = token.split(" "[1]);
      const payload = jwt.verify(token, process.env.SECRET);
      const user = await usuarioModel.findById(payload.user);

      if (!user.rol || roles.includes(user.rol)) {
        return response(
          res,
          403,
          false,
          "",
          `Acceso denegado, se requiere ser: [${roles.join}]`
        );
      }

      req.userId = payload.user;
      next();
    } catch (error) {
      return messageNoAuth(res);
    }
  };
};
