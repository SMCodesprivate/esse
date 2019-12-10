const mongoose = require("mongoose");

const Bot = new mongoose.Schema({
  id: String,
  version: Number,
  prefix: String,
  commands: Array
});

module.exports = mongoose.model("Infos", Bot);