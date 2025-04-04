import mongoose from "mongoose";

const { model, Schema } = mongoose;

const pagoSchema = new Schema(
  {
    turno: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "turno",
      required: [true, "El campo turno es requerido"],
    },
    monto: { type: Number, required: true },
    metodoPago: {
      type: String,
      enum: ["efectivo", "tarjeta", "transferencia"],
      required: [true, "El campo metodo de pago es requerido"],
    },
    estado: {
      type: String,
      default: "pagado",
    },
    fechaPago: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export const pagoModel = model("pago", pagoSchema);
