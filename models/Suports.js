const mongoose = require("mongoose");

const suport = new mongoose.Schema({
  name_channel: String,
  user_id: String,
  channel_id: String,
  data: {
    year: Number,
    month: Number,
    day: Number
  }
});

module.exports = mongoose.model("Suport", suport);