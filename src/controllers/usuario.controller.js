import mongoose from "mongoose";
import { encryptPassword } from "../helpers/cncrypt.password.js";
import { handleError } from "../helpers/error.handler.js";
import { generateToken } from "../helpers/generateToken.js";
import { response } from "../helpers/response.js";
import { usuarioModel } from "../models/usuario.model.js";
import bcrypt from "bcrypt";

const usuarioController = {};

// ** Obtener todos los usuarios

usuarioController.getUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioModel.find();
    if (usuarios.length === 0) {
      return response(res, 404, false, "", "No se encontraron usuarios");
    }
    return response(res, 200, true, usuarios, "Lista de usuarios");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** obetener usuarios por id

usuarioController.findUserById = async (req, res) => {
  try {
    const { idUser } = req.prams;
    if (!mongoose.Types.ObjectId.isValid(idUser)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const usuario = await usuarioModel.findById({ _id: idUser });
    if (!usuario) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro al usuario con el id ${idUser}`
      );
    }

    return response(res, 200, true, usuario, "Usuario encontrado");
  } catch (error) {
    return handleError(res, error);
  }
};

usuarioController.updateUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    const { email, password, rol } = req.body;

    if (!mongoose.Types.ObjectId.isValid(idUser)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const usuario = await usuarioModel.findById({ _id: idUser });
    if (!usuario) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro al usuario con el id ${idUser}`
      );
    }

    if (!email || !password || !rol) {
      return response(res, 400, false, "", "Los campos son requeridos");
    }

    if (usuario.email != email) {
      const emailExist = await usuarioModel.findOne({ email: email });
      if (emailExist) {
        return response(
          res,
          400,
          false,
          "",
          `El email ${email} ya se encuentra registrado`
        );
      }
    }

    if (rol != "administrador".toLowerCase()) {
      return response(
        res,
        400,
        false,
        "",
        "Si desea registrar un rol diferenete comuniquese con un TI"
      );
    }

    await usuario.updateOne(req.body);
    return response(res, 200, true, "", `Usuario actualizado con el id ${id}`);
  } catch (error) {
    return handleError(res, error);
  }
};

// ** Eliminar usuario

usuarioController.deleteUser = async (req, res) => {
  try {
    const { idUser } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idUser)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const usuario = await usuarioModel.findById({ _id: idUser });
    if (!usuario) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro al usuario con el id ${idUser}`
      );
    }

    await usuario.updateOne({ activo: false });
    return response(
      res,
      200,
      true,
      "",
      `Usuario desactivado con el id ${idUser}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** Register

usuarioController.registerUser = async (req, res) => {
  try {
    const { email, password, rol } = req.body;

    if (!email || !password || !rol) {
      return response(res, 400, false, "", "Los campos son requeridos");
    }

    const emailExist = await usuarioModel.findOne({ email: email });
    if (emailExist) {
      return response(
        res,
        400,
        false,
        "",
        `El email ${email} ya se encuentra registrado`
      );
    }

    if (password < 6) {
      return response(
        res,
        400,
        false,
        "",
        "El password no puede ser menor a 6 caracteres"
      );
    }

    if (rol != "administrador".toLowerCase()) {
      return response(
        res,
        400,
        false,
        "",
        "Si desea registrar un rol diferenete comuniquese con un TI"
      );
    }

    const passwordEncryptada = encryptPassword(password);
    const newUser = await usuarioModel.create({
      email,
      password: passwordEncryptada,
    });
    await newUser.save();
    const token = generateToken({ user: newUser._id });
    return response(res, 201, true, {
      ...newUser._doc,
      password: passwordEncryptada,
      token,
      rol,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// ** Login

usuarioController.loginUser = async (req, res) => {
  try {
    const { password, email } = req.body;

    if (!password || !email) {
      return response(
        res,
        400,
        false,
        "",
        "El password y el amil son requeridos"
      );
    }

    const emailExist = await usuarioModel.findOne({ email: email });
    if (!emailExist) {
      return response(res, 404, false, "", `Email no encontrado`);
    }

    const validPassword = await bcrypt.compare(password, email.password);
    if (!validPassword) {
      return response(res, 404, false, "", "Password incorrecto");
    }

    const token = generateToken(emailExist);

    return response(
      res,
      200,
      true,
      { token, user: emailExist, rol, password: null },
      "Login exitoso"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default usuarioController;
