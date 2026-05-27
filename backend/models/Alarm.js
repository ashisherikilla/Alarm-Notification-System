const mongoose = require("mongoose");

const alarmSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      default: "medium",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alarm", alarmSchema);