import mongoose from "mongoose";
import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { turnoModel } from "../models/turno.model.js";
import { pagoModel } from "../models/pago.model.js";
import { numeroAutoincrement } from "../helpers/numeroAutoincrement.js";

const turnoController = {};

// ** Obtener todos los turnos

turnoController.getAllTurnos = async (req, res) => {
  try {
    const turnos = await turnoModel.find();
    if (turnos.length === 0) {
      return response(res, 404, false, "", "No se encontraron turnos");
    }

    return response(res, 200, true, turnos, "Lista de turnos");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** Obtener turno por id

turnoController.getTurnoById = async (req, res) => {
  try {
    const { idTurno } = req.prams;

    if (!mongoose.Types.ObjectId.isValid(idTurno)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idTurno} no es valido para la base de datos`
      );
    }

    const turnoFound = await turnoModel.findById({ _id: idTurno });
    if (!turnoFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el turno con el id ${idTurno}`
      );
    }

    return response(
      res,
      200,
      true,
      turnoFound,
      `Turno encontrado con el id ${idTurno}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** 0btener turnos por turno

turnoController.getTurnoByTurno = async (req, res) => {
  try {
    const { turno } = req.params;

    const turnoFound = await turnoModel.findOne({ numeroTurno: turno });
    if (!turnoFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el numero de turno ${turno}`
      );
    }

    return response(res, 200, true, turnoFound, `Numero de turno ${turno}`);
  } catch (error) {}
};

// ** Obtener turnos pendientes

turnoController.getTurnoByPendiente = async (req, res) => {
  try {
    const turnosPendientes = await turnoModel.find({
      estado: "pendiente".toLowerCase(),
    });
    if (turnosPendientes.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron turnos con estado pendiente"
      );
    }

    return response(
      res,
      200,
      true,
      turnosPendientes,
      "Lista de turnos pendientes por entregar"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** Crear turno

turnoController.postTurno = async (req, res) => {
  try {
    const { tipo, estado, usuario, monto, metodoPago } = req.body;

    if (!tipo || !estado || !usuario || !monto || !metodoPago) {
      return response(
        res,
        400,
        false,
        "",
        "Faltan datos obligatorios para el turno y pago"
      );
    }

    if (!usuario.nombre || !usuario.email || !usuario.celular) {
      return response(
        res,
        400,
        false,
        "",
        "Los datos del usuario son obligatorios"
      );
    }

    if (tipo !== "domicilio".toLowerCase() && tipo !== "pedido".toLowerCase()) {
      return response(
        res,
        400,
        false,
        "",
        "El tipo del turno solo puede ser pedido o domicilio"
      );
    }

    if (estado !== "pendiente".toLowerCase()) {
      return response(
        res,
        400,
        false,
        "",
        "Al momento de crear el turno el estado debe ser pendiente"
      );
    }

    const numeroTurno = await numeroAutoincrement();
    const nuevoTurno = new turnoModel({
      numeroTurno,
      tipo,
      estado,
      usuario,
      pago: null,
    });
    await nuevoTurno.save();

    const nuevoPago = await pagoModel.create({
      turno: nuevoTurno._id,
      monto,
      metodoPago,
      estado: "pagado",
      fechaPago: new Date(),
    });

    nuevoTurno.pago = nuevoPago._id;
    await nuevoTurno.save();

    return response(
      res,
      201,
      true,
      nuevoTurno,
      "Turno creado con pago asociado"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** Cambiar el estado del turno

turnoController.putTurno = async (req, res) => {
  try {
    const { idTurno } = req.params;
    const { tipo, estado, usuario } = req.body;

    if (!mongoose.Types.ObjectId.isValid(idTurno)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idTurno} no es valido para la base de datos`
      );
    }

    const turnoFound = await turnoModel.findById({ _id: idTurno });
    if (!turnoFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el turno con el id ${idTurno}`
      );
    }

    if (!tipo || !estado || !usuario) {
      return response(
        res,
        400,
        false,
        "",
        "Faltan datos obligatorios para el turno y pago"
      );
    }

    if (!usuario.nombre || !usuario.email || !usuario.celular) {
      return response(
        res,
        400,
        false,
        "",
        "Los datos del usuario son obligatorios"
      );
    }

    if (tipo !== "domicilio".toLowerCase() && tipo !== "pedido".toLowerCase()) {
      return response(
        res,
        400,
        false,
        "",
        "El tipo del turno solo puede ser pedido o domicilio"
      );
    }

    if (estado !== "pendiente".toLowerCase()) {
      return response(
        res,
        400,
        false,
        "",
        "Al momento de crear el turno el estado debe ser pendiente"
      );
    }

    await turnoFound.updateOne(req.body);
    return response(res, 200, true, "", `Turno actualziado con el id ${id}`);
  } catch (error) {
    return handleError(res, error);
  }
};

// ** Eliminar turno

turnoController.deleteTurno = async (req, res) => {
  try {
    const { idTurno } = req.params;
    const { tipo, estado, usuario } = req.body;

    if (!mongoose.Types.ObjectId.isValid(idTurno)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${idTurno} no es valido para la base de datos`
      );
    }

    const turnoFound = await turnoModel.findById({ _id: idTurno });
    if (!turnoFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el turno con el id ${idTurno}`
      );
    }
  } catch (error) {
    return handleError(res, error);
  }
};

export default turnoController;
