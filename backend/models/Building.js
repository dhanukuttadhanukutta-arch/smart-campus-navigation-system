const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Building", buildingSchema);