const mongoose = require("mongoose");

const { Schema } = mongoose;

const institutionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model(
  "Institutions",
  institutionSchema,
  "institutions"
);
