const mongoose = require("mongoose");

const testes = new mongoose.Schema({
  teste: String
});

module.exports = mongoose.model("Teste", testes);