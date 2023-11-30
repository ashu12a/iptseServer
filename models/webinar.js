const mongoose = require("mongoose");

const { Schema } = mongoose;

const webinarSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "institutions",
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    speaker: [{
      name: String,
      organization: String,
      designation: String
    }]
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Webinars", webinarSchema, "webinars");
