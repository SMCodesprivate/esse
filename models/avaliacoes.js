const mongoose = require("mongoose");

const avaliacoes = new mongoose.Schema({
  user_id: String,
  user_id_avaliado: String,
  motivo: String,
  level: Number,
});

module.exports = mongoose.model("Avaliacoes", avaliacoes);