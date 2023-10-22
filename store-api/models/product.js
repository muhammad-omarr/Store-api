const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is must!"],
  },
  price: {
    type: Number,
    required: [true, "Price in must!"],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 1.0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: `{VALUE} is not supported`,
    },
  },
});

module.exports = mongoose.model("Product", productsSchema);
