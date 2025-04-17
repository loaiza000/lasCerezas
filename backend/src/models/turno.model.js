import mongoose from "mongoose";

const { model, Schema } = mongoose;

const turnoSchema = new Schema(
  {
    numeroTurno: { type: Number, unique: true, required: true },
    tipo: {
      type: String,
      enum: ["pedido", "domicilio"],
      required: [true, "El campo tipo es requerido"],
    },
    estado: {
      type: String,
      required: [true, "El campo estado es requerido"],
      enum: ["pendiente", "atendido", "cancelado"],
      default: "pendiente",
    },
    fechaCreacion: { type: Date, default: Date.now },
    usuario: {
      nombre: {
        type: String,
        required: [true, "El campo nombre de usuario es requerido"],
      },
      email: {
        type: String,
        required: [true, "El campo email de usuario es requerido"],
      },
      celular: {
        type: String,
        required: [true, "El campo celular de usuario es requerido"],
      },
    },
    producto: {
      nombreProduco: {
        type: String,
        required: [true, "El nombre del producto es requerido"],
      },
      especificaciones: { type: String },
    },

    pago: { type: mongoose.Schema.Types.ObjectId, ref: "pago" },
  },
  {
    timestamps: true,
  }
);

export const turnoModel = model("turno", turnoSchema);
