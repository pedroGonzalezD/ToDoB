import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  id: { type: Object },
  token: { type: String, required: true },
});

const Token = mongoose.model("Token", tokenSchema);

export default Token;
