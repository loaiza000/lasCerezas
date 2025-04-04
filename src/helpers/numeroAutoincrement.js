import { configModel } from "../models/Config.js";

export const numeroAutoincrement = async () => {
  const config = await configModel.findOneAndUpdate(
    { clave: "ultimoTurno" },
    { $inc: { valor: 1 } },
    { new: true, upsert: true }
  );
  return config.valor;
};
