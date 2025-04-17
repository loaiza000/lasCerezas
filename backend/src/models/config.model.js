import mongoose from "mongoose";

const { Schema, model } = mongoose;

const configSchema = new Schema({
  clave: { type: String, unique: true, required: true },
  valor: { type: Number, default: 0 },
});

export const configModel = model("config", configSchema);
