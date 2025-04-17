import mongoose from "mongoose";

const { model, Schema } = mongoose;

const usuarioSchema = new Schema(
  {
    email: { type: String, required: [true, "El campo email es requerido"] },
    password: {
      type: String,
      required: [true, "El campo password es requerido"],
    },
    rol: {
      type: String,
      required: [true, "El campo rol es requerido"],
      enum: ["administrador"],
    },
    activo: { type: Boolean, default: true },
    token: { type: String },
  },
  {
    timestamps: true,
  }
);

export const usuarioModel = model("usuario", usuarioSchema);
