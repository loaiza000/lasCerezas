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
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const turnoFound = await turnoModel.findById({ _id: id });
    if (!turnoFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el turno con el id ${id}`
      );
    }

    return response(
      res,
      200,
      true,
      turnoFound,
      `Turno encontrado con el id ${id}`
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
    const { tipo, estado, usuario, monto, metodoPago, producto } = req.body;

    if (!tipo || !estado || !usuario || !monto || !metodoPago || !producto) {
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

    if (!producto.nombreProducto || !producto.especificaciones) {
      return response(
        res,
        404,
        false,
        "",
        "Los datos del producto son obligatorios"
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

// ** Actualizar turno

turnoController.putTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, estado, usuario, producto } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const turnoFound = await turnoModel.findById({ _id: id });
    if (!turnoFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el turno con el id ${id}`
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
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const turnoFound = await turnoModel.findById({ _id: id });
    if (!turnoFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el turno con el id ${id}`
      );
    }

    await turnoFound.deleteOne();
    return response(res, 200, true, "", `Turno eliminado con el id ${id}`);
  } catch (error) {
    return handleError(res, error);
  }
};

// ** Obtener turnos por estado

turnoController.getTurnosByEstado = async (req, res) => {
  try {
    const { estado } = req.params;

    if (
      estado != "pendiente".toLowerCase() ||
      estado != "atendido".toLowerCase() ||
      estado != "cancelado".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El estado del turno solo puede ser pendiente, atendido o cancelado"
      );
    }

    const turnoByEstado = await turnoModel.find({ estado: estado });
    if (turnoByEstado.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontraron turnos con el estado ${estado}`
      );
    }

    return response(res, 200, true, "", `Turnos con el estado ${estado}`);
  } catch (error) {
    return handleError(res, error);
  }
};

export default turnoController;
