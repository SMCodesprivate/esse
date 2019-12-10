const mongoose = require("mongoose");

const Sugestoes = new mongoose.Schema({
  id: String,
  message: String,
  data: {
    year: Number,
    month: Number,
    day: Number
  }
});

module.exports = mongoose.model("Sugestoes", Sugestoes);