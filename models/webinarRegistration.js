const mongoose = require("mongoose");

const { Schema } = mongoose;

const webinarRegistrationSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
      required: true,
    },
    webinarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Webinars",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("WebinarRegistrations", webinarRegistrationSchema, "webinarRegistrations");
