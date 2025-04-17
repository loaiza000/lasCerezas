import mongoose from "mongoose";
import { handleError } from "../helpers/error.handler.js";
import { response } from "../helpers/response.js";
import { pagoModel } from "../models/pago.model.js";
import { turnoModel } from "../models/turno.model.js";

const pagoController = {};

// ** Obtener todos los pagos

pagoController.getAllPagos = async (req, res) => {
  try {
    const pagos = await pagoModel.find();
    if (pagos.lenght === 0) {
      return response(res, 404, false, "", "No se encontraron pagos");
    }

    return response(res, 200, true, pagos, "Pagos encontrados");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** Obtener todos los pagos por id

pagoController.getPagoById = async (req, res) => {
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

    const pagoFound = await pagoModel.findById({ _id: id });
    if (!pagoFound) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el pago con el id ${id}`
      );
    }

    return response(res, 200, true, pagoFound, "Pago encontrado");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** obtener pagos por metodo de pago

pagoController.getPagosByMetodo = async (req, res) => {
  try {
    const { metodo } = req.params;

    if (
      metodo != "efectivo".toLowerCase() ||
      metodo != "trajeta".toLowerCase() ||
      metodo != "transferencia".toLowerCase()
    ) {
      return response(
        res,
        400,
        false,
        "",
        "El metodo de pago solo puede ser efectivo, tarjeta o transferencia"
      );
    }

    const pagos = await pagoModel.find({ metodoPago: metodo });
    if (pagos.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontraron pagos con el metodo de pago ${metodo}`
      );
    }

    return response(
      res,
      200,
      true,
      pagos,
      `Pagos con el metodo de pago ${metodo}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** obtener pagos por turno

pagoController.getPagoByTurno = async (req, res) => {
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

    const pagoByTurno = await pagoModel.findOne({ turno: id });
    if (!pagoByTurno) {
      return response(
        res,
        404,
        false,
        "",
        `No se encontro el pago del turno con el id ${id}`
      );
    }

    return response(
      res,
      200,
      true,
      pagoByTurno,
      `Pago asociado al turno ${id}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default pagoController;
